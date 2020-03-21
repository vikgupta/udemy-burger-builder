import React from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../auxiliary/auxiliary';
import useHttpErrorHandler from '../../hooks/http-error-handler';

const withErrorHandler = (WrappedComponent, axios) => {
    return (
        props => {
            const [error, errorConfirmedHandler] = useHttpErrorHandler(axios);

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