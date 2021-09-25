import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import { Login, Register, Dashboard, ForgotPassword, PasswordRecovery, Profile } from "./pages"
import './app.css'

function App() {
  return (
    <Switch>
      <Route path="/password-recovery" component={PasswordRecovery} />
      <PublicRoute path="/login" component={Login} />
      <PublicRoute path="/register" component={Register} />
      <PublicRoute path="/forgot-password" component={ForgotPassword} />
      <PrivateRoute path="/profile" component={Profile} />
      <PrivateRoute path="/" component={Dashboard} exact />
      <PrivateRoute path="/folder/:folderId" exact component={Dashboard} />
    </Switch>
  );
}

export default App;
