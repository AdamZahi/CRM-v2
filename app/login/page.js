import { SignInButton } from "@clerk/nextjs"
import "../globals.css"
export default function LoginPage() {
    return (
        <div className="flex flex-col h-screen justify-center items-center">
            <h1 className="text-green-200">Looks like you didn&apos;t logged in yet!</h1>
            <p>Login with your credentials to continue</p>
            <SignInButton mode="modal" forceRedirectUrl={"/dashboard"}></SignInButton>
        </div>
    )
}
