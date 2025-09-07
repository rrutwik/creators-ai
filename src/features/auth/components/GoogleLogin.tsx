import { GoogleLogin } from "@react-oauth/google";
import { CardContent } from '../../../components/ui/card';
import { useEffect } from 'react';

export function GoogleLoginComponent({ handleLoginSuccess, handleLoginError }: { handleLoginSuccess: (response: any) => void, handleLoginError: (error: any) => void }) {
    useEffect(() => {
        // Expose the React handler to the global window object
        (window as any).handleDivManualLoginSuccess = (response: any) => {
            try {
                console.log("Login success:", response);
                handleLoginSuccess(response);
            } catch (err) {
                console.error("Login error:", err);
                handleLoginError(err);
            }
        };

    }, []);

    return (
        <CardContent className="space-y-4" style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {/* <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => handleLoginError("Login failed, please try again.")}
                containerProps={
                    {
                        style: {
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }
                    }
                }
                text="continue_with"
                theme="outline"
                shape="rectangular"
                size="large"
            /> */}
            <div id="g_id_onload"
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
            </div>
        </CardContent>
    )
}