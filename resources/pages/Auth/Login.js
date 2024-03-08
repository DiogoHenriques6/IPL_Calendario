import React, {useState} from 'react';
import {Form, Field} from 'react-final-form';
import axios from 'axios';
import {
    Button,
    Form as SemanticForm,
    Grid,
    Header,
    Segment,
    Image,
} from 'semantic-ui-react';
import jwtDecode from 'jwt-decode';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import logoSVG from '../../logo.svg';

const SweetAlertComponent = withReactContent(Swal);

const LoginPage = () => {
    const [loading, setLoading] = useState(false);

    const onSubmit = (values) => {
        setLoading(true);
        axios.post('/login', {
                email: values.email,
                password: values.password,
                remember_me: false,
            }).then(({data}) => {
                if (data.accessToken) {
                    localStorage.setItem('userId', data.user.id);
                    localStorage.setItem('username', data.user.name);
                    localStorage.setItem('groups', data.user.groups);
                    localStorage.setItem('authToken', data.accessToken);
                    localStorage.setItem('academicYear', data.academicYear);
                    const {scopes} = jwtDecode(data.accessToken);
                    localStorage.setItem('scopes', JSON.stringify(scopes));
                    if (scopes?.length === 0) {
                        return (window.location = '/calendario/');
                    }
                    window.location = '/';
                }
            }).catch((err) => {
                setLoading(false);
                SweetAlertComponent.fire({
                    title: 'Erro de autenticação!',
                    text: 'Contactar o suporte DEI',
                    icon: 'error',
                    confirmButtonColor: 'red',
                });
            });
    };

    return (
        <Grid textAlign="center" style={{height: '100vh'}} verticalAlign="middle">
            <Grid.Column style={{maxWidth: 450}}>
                <Image src={logoSVG}/>
                <Header as="h2" style={{color: '#1c1c1c'}} textAlign="center">Gestão de Calendários de Avaliação</Header>
                <Form onSubmit={onSubmit}
                    render={({handleSubmit}) => (
                        <SemanticForm size="large" autoComplete="new-password">
                            <Segment>
                                <Field name="email">
                                    {({input: usernameInput}) => (
                                        <SemanticForm.Input fluid icon="user" iconPosition="left" placeholder="Email"
                                            {...usernameInput}
                                        />
                                    )}
                                </Field>
                                <Field name="password">
                                    {({input: passwordInput}) => (
                                        <SemanticForm.Input fluid icon="lock" iconPosition="left" placeholder="Password"
                                            type="password" name="password"{...passwordInput}/>
                                    )}
                                </Field>
                                <Button onClick={handleSubmit}
                                    style={{
                                        backgroundColor: '#edaa00',
                                        color: 'white',
                                        cursor: 'pointer',
                                    }}
                                    fluid size="large" loading={loading}>
                                    Login
                                </Button>
                            </Segment>
                        </SemanticForm>
                    )}
                />
            </Grid.Column>
        </Grid>
    );
};

export default LoginPage;
