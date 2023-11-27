import LoadingGif from '../assets/loading.gif';
import styled from 'styled-components';

const Loading = () => {
    return (
        <LoadingImageBox>
            <img src={LoadingGif} alt="LoadingGif" />
        </LoadingImageBox>
    );
}

export default Loading;

const LoadingImageBox = styled.div`
    width: 100%;
    height: 100;
    >img{
        width: 100px;
        height: 100px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999999;
    }
`;