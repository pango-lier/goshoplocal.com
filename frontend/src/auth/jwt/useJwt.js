// ** Core JWT Import
import useJwt from '@src/@core/auth/jwt/useJwt'


const { jwt } = useJwt(
    {
        loginEndpoint: `${process.env.REACT_APP_SERVER_URL}/auth/jwt/login`,
        registerEndpoint: `${process.env.REACT_APP_SERVER_URL}/auth/jwt/register`,
        refreshEndpoint: `${process.env.REACT_APP_SERVER_URL}/auth/jwt/refresh-token`,
        logoutEndpoint: `${process.env.REACT_APP_SERVER_URL}/auth/jwt/logout `,
    }
)

export default jwt
