import { Body, Button, Container, Head, Heading, Hr, Html, Img, Preview, Section, Text } from "@react-email/components"

interface InvoiceReceiptEmailProps {
  clientName: string
  invoiceNumber: string
  amount: string
  paymentDate: string
  paymentMethod: string
  transactionId: string
  invoiceLink: string
  companyName: string
  companyEmail: string
  companyPhone: string
  companyLogo?: string
}

export const InvoiceReceiptEmail = ({
  clientName,
  invoiceNumber,
  amount,
  paymentDate,
  paymentMethod,
  transactionId,
  invoiceLink,
  companyName,
  companyEmail,
  companyPhone,
  companyLogo = "https://quotlyo.com/logo.png",
}: InvoiceReceiptEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Payment Receipt for Invoice {invoiceNumber} from {companyName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src={companyLogo} width="120" height="40" alt={companyName} style={logo} />
          <Heading style={heading}>Payment Receipt</Heading>

          <Section style={section}>
            <Text style={text}>Dear {clientName},</Text>
            <Text style={text}>
              Thank you for your payment of {amount} for invoice #{invoiceNumber}. This email confirms that your payment
              has been received and processed successfully.
            </Text>

            <Section style={receiptBox}>
              <Heading as="h2" style={receiptHeading}>
                Payment Details
              </Heading>
              <Hr style={hr} />
              <Section style={receiptRow}>
                <Text style={receiptLabel}>Invoice Number:</Text>
                <Text style={receiptValue}>{invoiceNumber}</Text>
              </Section>
              <Section style={receiptRow}>
                <Text style={receiptLabel}>Amount Paid:</Text>
                <Text style={receiptValue}>{amount}</Text>
              </Section>
              <Section style={receiptRow}>
                <Text style={receiptLabel}>Payment Date:</Text>
                <Text style={receiptValue}>{paymentDate}</Text>
              </Section>
              <Section style={receiptRow}>
                <Text style={receiptLabel}>Payment Method:</Text>
                <Text style={receiptValue}>{paymentMethod}</Text>
              </Section>
              <Section style={receiptRow}>
                <Text style={receiptLabel}>Transaction ID:</Text>
                <Text style={receiptValue}>{transactionId}</Text>
              </Section>
            </Section>

            <Section style={buttonContainer}>
              <Button pX={20} pY={12} style={button} href={invoiceLink}>
                View Invoice
              </Button>
            </Section>

            <Text style={text}>We appreciate your business and look forward to working with you again.</Text>

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

const receiptBox = {
  padding: "24px",
  backgroundColor: "#f9f9f9",
  borderRadius: "4px",
  margin: "24px 0",
}

const receiptHeading = {
  fontSize: "18px",
  margin: "0 0 16px",
  color: "#484848",
}

const receiptRow = {
  display: "flex",
  justifyContent: "space-between",
  margin: "8px 0",
}

const receiptLabel = {
  fontSize: "14px",
  color: "#687087",
  margin: "0",
}

const receiptValue = {
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
  backgroundColor: "#10b981", // green
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

export default InvoiceReceiptEmail
