import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import { Login, Register, Dashboard, ForgotPassword, PasswordRecovery } from "./pages"


function App() {
  return (
    <Switch>
      <Route path="/" component={Login} exact />
      <Route path="/password-recovery" component={PasswordRecovery} />
      <PublicRoute path="/login" component={Login} />
      <PublicRoute path="/register" component={Register} />
      <PublicRoute path="/forgot-password" component={ForgotPassword} />
      <PrivateRoute path="/dashboard" component={Dashboard} />
    </Switch>
  );
}

export default App;
