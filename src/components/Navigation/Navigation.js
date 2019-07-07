import React from 'react'

 const Navigation = ({onRouteChange,isSignedIn}) => {
        if(isSignedIn){
            return(
             <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                 <p onClick={() => onRouteChange('signOut')} className={'f3 link black underline pa3 pointer'}>Sign Out</p>
             </nav>
            )
        } else {
            return(
                <div>
                    <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <p onClick={() => onRouteChange('signIn')} className={'f3 link black underline pa3 pointer'}>Sign In</p>
                        <p onClick={() => onRouteChange('register')} className={'f3 link black underline pa3 pointer'}>Register</p>
                    </nav>
                </div>
            )
    }
};
export default Navigation;