// ** React Imports
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AbilityContext } from '@src/utility/context/Can'
import { useForm, Controller } from 'react-hook-form'
import useJwt from '@src/auth/jwt/useJwt'
import toast from 'react-hot-toast'
import { handleLogin } from '@store/authentication'
import { getHomeRouteForLoggedInUser } from '@utils'

// ** Icons Imports
import { Facebook, Twitter, Mail, GitHub, HelpCircle, Coffee, X } from 'react-feather'

import { useDispatch } from 'react-redux'
// ** Custom Components
import Avatar from '@components/avatar'
import InputPasswordToggle from '@components/input-password-toggle'

// ** Reactstrap Imports
import { Card, CardBody, CardTitle, CardText, Form, Label, Input, Button } from 'reactstrap'

// ** Styles
import '@styles/react/pages/page-authentication.scss'

const ToastContent = ({ t }) => {
  return (
    <div className='d-flex'>
      <div className='me-1'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
      </div>
      <div className='d-flex flex-column'>
        <div className='d-flex justify-content-between'>
          <h6>Genette</h6>
          <X size={12} className='cursor-pointer' onClick={() => toast.dismiss(t.id)} />
        </div>
        <span>You have successfully logged in as an CEO to Spectron.inc. Now you can start to explore. Enjoy!</span>
      </div>
    </div>
  )
}

const defaultValues = {
  password: 'admin',
  loginEmail: 'admin@demo.com'
}


const LoginBasic = () => {

// ** Hooks
//const { skin } = useSkin()
const dispatch = useDispatch()
const navigate = useNavigate()
const ability = useContext(AbilityContext)
const {
  control,
  setError,
  handleSubmit,
  formState: { errors }
} = useForm({ defaultValues })
// const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg',
//   source = require(`@src/assets/images/pages/${illustration}`).default

const onSubmit = data => {
  if (Object.values(data).every(field => field.length > 0)) {
    useJwt
      .login({ email: data.loginEmail, password: data.password })
      .then(res => {
        const data = { ...res.data.userData, accessToken: res.data.accessToken, refreshToken: res.data.refreshToken }
        dispatch(handleLogin(data))
        ability.update(res.data.userData.ability)
        navigate(getHomeRouteForLoggedInUser(data.role))
        toast(t => (
          <ToastContent t={t} role={data.role || 'admin'} name={data.fullName || data.username || 'Genette'} />
        ))
      })
      .catch(err => console.log(err))
  } else {
    for (const key in data) {
      if (data[key].length === 0) {
        setError(key, {
          type: 'manual'
        })
      }
    }
  }
}
  return (
    <div className='auth-wrapper auth-basic px-2'>
      <div className='auth-inner my-2'>
        <Card className='mb-0'>
          <CardBody>
            <Link className='brand-logo' to='/' >
              <img src='/static/media/spectrol.aee3a8b2.png' style={{ width:150 }}/>
              {/* <h2 className='brand-text text-primary ms-1'>Spectron.inc</h2> */}
            </Link>
            <CardTitle tag='h4' className='mb-1'>
              Welcome to Spectron.inc! 👋
            </CardTitle>
            <CardText className='mb-2'>Please sign-in to your account and start the adventure</CardText>
            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-1'>
                <Label className='form-label' for='login-email'>
                  Email
                </Label>
                <Controller
                  id='loginEmail'
                  name='loginEmail'
                  control={control}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type='email'
                      placeholder='john@example.com'
                      invalid={errors.loginEmail && true}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className='mb-1'>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='login-password'>
                    Password
                  </Label>
                  <Link to='/forgot-password'>
                    <small>Forgot Password?</small>
                  </Link>
                </div>
                <Controller
                  id='password'
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle className='input-group-merge' invalid={errors.password && true} {...field} />
                  )}
                />
              </div>
              <div className='form-check mb-1'>
                <Input type='checkbox' id='remember-me' />
                <Label className='form-check-label' for='remember-me'>
                  Remember Me
                </Label>
              </div>
              <Button type='submit' color='primary' block>
                Sign in
              </Button>
            </Form>
            <p className='text-center mt-2'>
              <span className='me-25'>New on our platform?</span>
              <Link to='/pages/register-basic'>
                <span>Create an account</span>
              </Link>
            </p>
            <div className='divider my-2'>
              <div className='divider-text'>or</div>
            </div>
            <div className='auth-footer-btn d-flex justify-content-center'>
              <Button color='facebook'>
                <Facebook size={14} />
              </Button>
              <Button color='twitter'>
                <Twitter size={14} />
              </Button>
              <Button color='google'>
                <Mail size={14} />
              </Button>
              <Button className='me-0' color='github'>
                <GitHub size={14} />
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default LoginBasic
