import { GoogleLogin } from "@react-oauth/google";
import { CardContent } from "../../../components/ui/card";
import { useEffect } from "react";
import * as Sentry from "@sentry/react";

export function GoogleLoginComponent({
  handleLoginSuccess,
  handleLoginError,
}: {
  handleLoginSuccess: (response: any) => void;
  handleLoginError: (error: any) => void;
}) {
//   useEffect(() => {
//     // Expose the React handler to the global window object
//     (window as any).handleDivManualLoginSuccess = (response: any) => {
//       try {
//         console.log("Login success:", response);
//         Sentry.captureMessage(
//           `Login success: ${JSON.stringify(response)}`,
//           "info"
//         );
//         handleLoginSuccess(response);
//       } catch (err) {
//         console.error("Login error:", err);
//         Sentry.captureMessage(`Login error: ${JSON.stringify(err)}`, "error");
//         handleLoginError(err);
//       }
//     };
//     return () => {
//       (window as any).handleDivManualLoginSuccess = undefined;
//     };
//   }, [handleLoginError, handleLoginSuccess]);

  return (
    <CardContent className="w-full h-full flex justify-center items-center">
      <GoogleLogin
        onSuccess={(response) => {
          try {
            console.log("Login success:", response);
            Sentry.captureMessage(
              `Login success: ${JSON.stringify(response)}`,
              "info"
            );
            handleLoginSuccess(response);
          } catch (err) {
            console.error("Login error:", err);
            Sentry.captureException(err);
            handleLoginError(err);
          }
        }}
        onError={() => {
          Sentry.captureMessage("Login failed", "error");
          handleLoginError("Login failed, please try again.");
        }}
        containerProps={{
          style: {
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
        text="signin_with"
        theme="filled_blue"
        shape="pill"
        size="large"
        width="320"
      />
      {/* <div id="g_id_onload"
                data-client_id="201954194593-36t0nksh9jusg01k58et81ct27objt26.apps.googleusercontent.com"
                data-context="signin"
                data-ux_mode="popup"
                data-callback="handleDivManualLoginSuccess"
                data-nonce=""
                data-auto_select="true"
                data-itp_support="true">
            </div>

            <div className="g_id_signin"
                data-type="standard"
                data-shape="pill"
                data-theme="filled_blue"
                data-text="signin_with"
                data-size="large"
                data-locale="en-US"
                data-logo_alignment="left"
                data-width="300px">
            </div> */}
    </CardContent>
  );
}
