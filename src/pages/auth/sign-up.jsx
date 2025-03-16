import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useState } from "react";  // Import useState hook
import axios from "axios";  // Import axios to make API calls
import apiInstance from "./useAuth";

export function SignUp() {
  // State to hold the form inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State to handle errors
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Create the payload for the API
    const userData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      password2: confirmPassword, // password confirmation field
    };

    try {
      // Send POST request to register the user
      const response = await apiInstance.post("/user/registration/", userData);

      if (response.status === 201) {
        // Handle successful registration, like redirecting or showing a success message
        console.log("User registered successfully", response.data);
        // Optionally, redirect to the login page or show a success message
      }
    } catch (error) {
      // Handle error, e.g., if the email is already in use or any validation errors
      if (error.response) {
        setError(error.response.data.message || "An error occurred");
      } else {
        setError("Network Error");
      }
    }
  };

  return (
    <section className="m-8 flex">
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Join Us Today</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to register.</Typography>
        </div>
        <form onSubmit={handleRegister} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div>
            <div className="flex gap-x-4">
              <div className="w-1/2 mb-1 flex flex-col gap-6 ">
                <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                  First Name
                </Typography>
                <Input
                  size="lg"
                  type="text"
                  placeholder="First Name"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>
              <div className="w-1/2 mb-1 flex flex-col gap-6">
                <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                  Last Name
                </Typography>
                <Input
                  type="text"
                  size="lg"
                  placeholder="Last Name"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>
            </div>
            <div className="mb-4 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Your email
              </Typography>
              <Input
                size="lg"
                type="email"
                placeholder="example@mail.com"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div className="flex gap-x-4">
              <div className="w-1/2 mb-1 flex flex-col gap-6">
                <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                  Create Password
                </Typography>
                <Input
                  size="lg"
                  type="password"
                  placeholder="Password"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>
              <div className="w-1/2 mb-1 flex flex-col gap-6">
                <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                  Confirm Password
                </Typography>
                <Input
                  size="lg"
                  type="password"
                  placeholder="Confirm Password"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="mt-6" fullWidth>
            Register Now
          </Button>

          {/* Error message */}
          {error && (
            <Typography variant="paragraph" color="red" className="mt-4 text-center">
              {error}
            </Typography>
          )}

          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Already have an account?
            <Link to="/auth/sign-in" className="text-gray-900 ml-1">Sign in</Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignUp;
