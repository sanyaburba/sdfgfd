import React, {useState, useEffect, useCallback} from 'react';
import {Paper, TextField, Button, Typography} from "@material-ui/core";
import FileBase from "react-file-base64";


import useStyles from './styles';
import {useDispatch} from "react-redux";
import {createPost, updatePost} from "../../Redux/actions/posts";
import {useSelector} from "react-redux";
import PropTypes from "prop-types";


//Get the current id of the post

const Form = ({currentId, setCurrentId}) => {
    const [postData, setPostData] = useState({
         title: '', message: '', tags: '', selectedFile: ''
    });
    const post = useSelector((state) => currentId ? state.posts.find((p) => p.id === currentId) : null);
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));

    useEffect(() => {
        if (post) setPostData(post);
    }, [post]);


    const clear = useCallback(() => {
        setCurrentId(null);
        setPostData({title: '', message: '', tags: '', selectedFile: ''});
    },[setCurrentId]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (currentId === null) {
            dispatch(createPost({...postData, name: user?.result?.name}));
        } else {
            dispatch(updatePost(currentId, {...postData, name: user?.result?.name}));
        }
        clear();
    }, [ clear, currentId, dispatch, postData, user?.result?.name]);


    const onChangeTitle = () => {
         return event => setPostData({...postData, title: event.target.value});
    };
    const onChangeMessage = () => {
        return (event) => setPostData({...postData, message: event.target.value});
    };
    const onChangeTags = () => {
        return (event) => setPostData({...postData, tags: event.target.value.split(',')});
    };
    const onDoneFile = () => {
        return ({base64}) => setPostData({...postData, selectedFile: base64});
    };

    if(!user?.result?.name) {
        return (
            <Paper className={classes.paper}>
                <Typography variant="h6" align="center">
                    Sign in to create posts
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper className={classes.paper}>
            <form autoComplete='off'
                  noValidate
                  className={`${classes.root} ${classes.form}`}
                  onSubmit={handleSubmit}>
                <Typography
                    variant='h6'>{currentId ? 'Editing the post' : 'Creating a post'}
                </Typography>
                <TextField
                    name="title"
                    variant='outlined'
                    label='title'

                    fullWidth value={postData.title}
                    onChange={onChangeTitle()}/>
                <TextField
                    name="message"
                    variant='outlined'
                    label='message'
                    fullWidth value={postData.message}
                    onChange={onChangeMessage()}/>
                <TextField
                    name="tags"
                    variant='outlined'
                    label='tags'
                    fullWidth value={postData.tags}
                    onChange={onChangeTags()}/>
                <div className={classes.fileInput}>
                    <FileBase
                        type='file'
                        multiple={false}
                        onDone={onDoneFile()}/>
                </div>
                <Button
                    className={classes.buttonSubmit}
                    variant='contained'
                    color='primary'
                    size='large'
                    type='submit'
                    fullWidth>submit</Button>
            </form>
        </Paper>
    );
};

Form.propTypes = {
    setCurrentId: PropTypes.func.isRequired,
    currentId: PropTypes.string
};

Form.defaultProps = {
    currentId: PropTypes[null]
};

export default Form;
