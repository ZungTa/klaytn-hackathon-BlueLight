import React, { Component } from 'react';
import LoginModalContainer from 'containers/modal/LoginModalContainer';
import RewardsModalContainer from 'containers/modal/RewardsModalContainer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseActions from 'store/modules/base';
import * as caverActions from 'store/modules/caver';

class Base extends Component {
    caverInitialize = async () => {
        const { CaverActions } = this.props
        await CaverActions.initialize()
        CaverActions.checkLogin()
    }

    componentDidMount() {
        this.caverInitialize()
    }
    
    render() {
        return (
            <div>
                <LoginModalContainer />
                <RewardsModalContainer />
                {/* 전역적으로 사용하는 컴포넌트들이 있다면
                    여기에서 렌더링 한다. */}
            </div>
        );
    }
}

export default connect(
    null,
    (dispatch) => ({
        BaseActions: bindActionCreators(baseActions, dispatch),
        CaverActions: bindActionCreators(caverActions, dispatch),
    })
)(Base);
