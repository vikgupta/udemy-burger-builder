import React, {useState, useEffect} from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../auxiliary/auxiliary';

const withErrorHandler = (WrappedComponent, axios) => {
    return (
        props => {
            const [error, setError] = useState(null);

            const reqInterceptor = axios.interceptors.request.use(req => {
                setError(null)
                return req;
            }, err => {
                setError(err);
            });

            const responseInterceptor = axios.interceptors.response.use(res => res, err => {
                setError(err);
            });

            useEffect(() => {
                return () => {
                    axios.interceptors.request.eject(reqInterceptor);
                    axios.interceptors.response.eject(responseInterceptor);  
                }
            }, [reqInterceptor, responseInterceptor]);

            const errorConfirmedHandler = () => {
                setError(null);
            }

            return (
                <Aux>
                    <Modal 
                        show={error}
                        modalClosed={errorConfirmedHandler}>
                        {error ? error.message : 'Something Went Wrong!'}
                    </Modal>
                    <WrappedComponent {...props} />
                </Aux>
            );
        }
    );
}

export default withErrorHandler;