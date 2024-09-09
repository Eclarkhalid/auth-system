import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import LoginForm from "@/components/LoginForm"

export const description =
  "A login form with first name, last name, email and password inside a card. There's an option to login with GitHub and a link to login if you already have an account"

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
