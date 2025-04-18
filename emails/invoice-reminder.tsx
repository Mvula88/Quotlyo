import { Body, Button, Container, Head, Heading, Hr, Html, Img, Preview, Section, Text } from "@react-email/components"

interface InvoiceReminderEmailProps {
  clientName: string
  invoiceNumber: string
  amount: string
  dueDate: string
  status: "upcoming" | "due" | "overdue"
  invoiceLink: string
  companyName: string
  companyEmail: string
  companyPhone: string
  companyLogo?: string
}

export const InvoiceReminderEmail = ({
  clientName,
  invoiceNumber,
  amount,
  dueDate,
  status,
  invoiceLink,
  companyName,
  companyEmail,
  companyPhone,
  companyLogo = "https://quotlyo.com/logo.png",
}: InvoiceReminderEmailProps) => {
  const statusText = {
    upcoming: "will be due soon",
    due: "is due today",
    overdue: "is overdue",
  }[status]

  const statusColor = {
    upcoming: "#3b82f6", // blue
    due: "#f59e0b", // amber
    overdue: "#ef4444", // red
  }[status]

  return (
    <Html>
      <Head />
      <Preview>
        Invoice {invoiceNumber} from {companyName} - {status === "overdue" ? "Overdue" : "Payment Reminder"}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src={companyLogo} width="120" height="40" alt={companyName} style={logo} />
          <Heading style={heading}>Invoice Payment Reminder</Heading>

          <Section style={section}>
            <Text style={text}>Dear {clientName},</Text>
            <Text style={text}>
              This is a friendly reminder that invoice #{invoiceNumber} for {amount} {statusText}.
            </Text>

            <Section style={invoiceInfoBox}>
              <Heading as="h2" style={invoiceInfoHeading}>
                Invoice Details
              </Heading>
              <Hr style={hr} />
              <Section style={invoiceInfoRow}>
                <Text style={invoiceInfoLabel}>Invoice Number:</Text>
                <Text style={invoiceInfoValue}>{invoiceNumber}</Text>
              </Section>
              <Section style={invoiceInfoRow}>
                <Text style={invoiceInfoLabel}>Amount Due:</Text>
                <Text style={invoiceInfoValue}>{amount}</Text>
              </Section>
              <Section style={invoiceInfoRow}>
                <Text style={invoiceInfoLabel}>Due Date:</Text>
                <Text style={invoiceInfoValue}>{dueDate}</Text>
              </Section>
              <Section style={invoiceInfoRow}>
                <Text style={invoiceInfoLabel}>Status:</Text>
                <Text style={{ ...invoiceInfoValue, color: statusColor, fontWeight: "bold" }}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </Section>
            </Section>

            <Section style={buttonContainer}>
              <Button pX={20} pY={12} style={button} href={invoiceLink}>
                View and Pay Invoice
              </Button>
            </Section>

            <Text style={text}>If you have already made the payment, please disregard this reminder.</Text>

            <Text style={text}>Thank you for your business!</Text>

            <Text style={signature}>
              Best regards,
              <br />
              {companyName}
              <br />
              {companyEmail}
              <br />
              {companyPhone}
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "24px",
  borderRadius: "4px",
  maxWidth: "600px",
}

const logo = {
  margin: "0 auto 24px",
  display: "block",
}

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  textAlign: "center" as const,
}

const section = {
  padding: "0",
}

const text = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#484848",
}

const invoiceInfoBox = {
  padding: "24px",
  backgroundColor: "#f9f9f9",
  borderRadius: "4px",
  margin: "24px 0",
}

const invoiceInfoHeading = {
  fontSize: "18px",
  margin: "0 0 16px",
  color: "#484848",
}

const invoiceInfoRow = {
  display: "flex",
  justifyContent: "space-between",
  margin: "8px 0",
}

const invoiceInfoLabel = {
  fontSize: "14px",
  color: "#687087",
  margin: "0",
}

const invoiceInfoValue = {
  fontSize: "14px",
  color: "#484848",
  fontWeight: "500",
  margin: "0",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
}

const button = {
  backgroundColor: "#0070f3",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
}

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
}

const signature = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#484848",
  marginTop: "32px",
}

const footer = {
  color: "#9ca3af",
  fontSize: "14px",
  marginTop: "16px",
  textAlign: "center" as const,
}

export default InvoiceReminderEmail
