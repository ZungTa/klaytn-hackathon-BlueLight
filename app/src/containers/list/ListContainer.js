import React, { Component } from 'react';
import PostList from 'components/list/PostList';
import Pagination from 'components/list/Pagination';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as listActions from 'store/modules/list';
// import list from '../../store/modules/list';

import { drizzleConnect } from 'drizzle-react'
import { Drizzle } from 'drizzle'
import drizzleOptions from '../../drizzleOptions'

class ListContainer extends Component {
    state = { drizzle: null }

    getPostList = () => {
        // 페이지와 태그 값을 부모에게서 받아 온다.
        const { tag, page, ListActions } = this.props;
        ListActions.getPostList({ page, tag });
    };

    componentDidMount() {
        this.setState({
            drizzle: new Drizzle(drizzleOptions)
        })

        console.log('pbw ListContainer props?', this.props)
        this.getPostList();
    }

    componentDidUpdate(prevProps, prevState) {
        // 페이지/태그가 바뀔 때 리스트를 다시 불러온다.
        if (
            prevProps.page !== this.props.page ||
            prevProps.tag !== this.props.tag
        ) {
            this.getPostList();
            // 스크롤바를 맨 위로 올린다.
            document.documentElement.scrollTop = 0;
        }
    }

    getDrizzlePostLen = async () => {
        const { drizzle } = this.state
        console.log("getDrizzlePostLen", drizzle)
        const PostDB = await drizzle.contracts.PostDB

        const postLen = await PostDB.methods.getPostLen().call();
        console.log('postlen', postLen)

        return postLen;
    }

    getPostList = async () => {
        const postLen = await getDrizzlePostLen()

        for (let i = 0; i < postLen; i++) {

        }
    }

    render() {
        const { loading, posts, page, lastPage, tag } = this.props;

        const postLen = this.getDrizzlePostLen()

        // const drizzlePosts = this.getDrizzlePosts()

        if (loading) return null; // 로딩중이면 아무것도 보이지 않는다.

        return (
            <div>
                <div>
                </div>
                <PostList posts={posts} />
                <Pagination page={page} lastPage={lastPage} tag={tag} />
            </div>
        );
    }
}

const drizzleListContainer = drizzleConnect(
    ListContainer,
    (state) => {
        console.log('pbw drizzle List', state)

        return {
            accounts: state.accounts,
            SimpleStorage: state.contracts.SimpleStorage,
            PostDB: state.contracts.PostDB,
            TutorialToken: state.contracts.TutorialToken,
            drizzleStatus: state.drizzleStatus,
        }
    }
)

export default connect(
    (state) => ({
        posts: state.list.get('posts'),
        lastPage: state.list.get('lastPage'),
        loading: state.pender.pending['list/GET_POST_LIST'],
    }),
    (dispatch) => ({
        ListActions: bindActionCreators(listActions, dispatch),
    })
)(drizzleListContainer);
