import React from "react";

const AuthLayout = ( {children}: {children: React.ReactNode} ) => {
    return ( 
        <div className="flex min-h-full max-h-[120%] flex-col items-center justify-center p-8">
            {children}
        </div>
     );
}
 
export default AuthLayout;