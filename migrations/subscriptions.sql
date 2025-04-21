-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  billing_interval VARCHAR(20) NOT NULL DEFAULT 'monthly',
  features JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscription_invoices table
CREATE TABLE IF NOT EXISTS subscription_invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  billing_reason VARCHAR(50) NOT NULL,
  invoice_pdf_url TEXT,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default plans
INSERT INTO plans (name, description, price, currency, billing_interval, features)
VALUES 
('Free', 'Basic features for small businesses', 0.00, 'USD', 'monthly', '{"max_invoices": 10, "max_clients": 5, "max_quotations": 5, "premium_templates": false, "recurring_invoices": false, "auto_reminders": false, "multi_currency": false}'),
('Pro', 'Advanced features for growing businesses', 19.99, 'USD', 'monthly', '{"max_invoices": 100, "max_clients": 50, "max_quotations": 50, "premium_templates": true, "recurring_invoices": true, "auto_reminders": true, "multi_currency": true}');

-- Create RLS policies
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_invoices ENABLE ROW LEVEL SECURITY;

-- Plans are readable by all authenticated users
CREATE POLICY "Plans are readable by all authenticated users"
ON plans FOR SELECT
TO authenticated
USING (true);

-- Subscriptions are readable and updatable by the user who owns them
CREATE POLICY "Subscriptions are readable by the user who owns them"
ON subscriptions FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Subscriptions are updatable by the user who owns them"
ON subscriptions FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Subscription invoices are readable by the user who owns the subscription
CREATE POLICY "Subscription invoices are readable by the user who owns the subscription"
ON subscription_invoices FOR SELECT
TO authenticated
USING (
  subscription_id IN (
    SELECT id FROM subscriptions WHERE user_id = auth.uid()
  )
);

-- Create function to get current user's subscription
CREATE OR REPLACE FUNCTION get_user_subscription()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  plan_id UUID,
  plan_name TEXT,
  plan_price DECIMAL(10, 2),
  status TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  features JSONB
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.user_id,
    s.plan_id,
    p.name as plan_name,
    p.price as plan_price,
    s.status,
    s.current_period_end,
    p.features
  FROM 
    subscriptions s
  JOIN 
    plans p ON s.plan_id = p.id
  WHERE 
    s.user_id = auth.uid()
  AND 
    s.status = 'active'
  ORDER BY 
    s.current_period_end DESC
  LIMIT 1;
END;
$$;

-- Create function to check if a user has access to a premium feature
CREATE OR REPLACE FUNCTION has_premium_feature(feature_name TEXT)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  user_features JSONB;
BEGIN
  SELECT p.features INTO user_features
  FROM subscriptions s
  JOIN plans p ON s.plan_id = p.id
  WHERE s.user_id = auth.uid()
  AND s.status = 'active'
  AND s.current_period_end > NOW()
  ORDER BY s.current_period_end DESC
  LIMIT 1;

  -- If no active subscription found, return false
  IF user_features IS NULL THEN
    RETURN false;
  END IF;

  -- Check if the feature exists and is true, or if it's a numeric limit
  IF jsonb_typeof(user_features->feature_name) = 'boolean' THEN
    RETURN (user_features->>feature_name)::boolean;
  ELSIF jsonb_typeof(user_features->feature_name) = 'number' THEN
    RETURN (user_features->>feature_name)::integer > 0;
  ELSE
    RETURN false;
  END IF;
END;
$$;

-- Create function to assign free plan to new users
CREATE OR REPLACE FUNCTION assign_free_plan_to_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  free_plan_id UUID;
  one_month_later TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get the free plan ID
  SELECT id INTO free_plan_id FROM plans WHERE name = 'Free' LIMIT 1;
  
  -- Calculate one month from now
  one_month_later := NOW() + INTERVAL '1 month';
  
  -- Create a subscription for the new user
  INSERT INTO subscriptions (
    user_id, 
    plan_id, 
    status, 
    current_period_start, 
    current_period_end
  ) VALUES (
    NEW.id, 
    free_plan_id, 
    'active', 
    NOW(), 
    one_month_later
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger to assign free plan to new users
CREATE TRIGGER assign_free_plan_after_user_creation
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION assign_free_plan_to_new_user();
