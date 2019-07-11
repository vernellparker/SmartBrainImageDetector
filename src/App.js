import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Rank from './components/Rank/Rank'
import SignIn from './components/Signin/SignIn'
import Register from './components/Register/Register'
import Particles from 'react-particles-js';
import './App.css';



const particlesOptions = {
    particles: {
        number:{
            value:150,
            density:{
                enable: true,
                value_area:800
            }
        }
    }
};
const initState ={
    input:'',
    imageUrl:'',
    box:{},
    route:'signIn',
    isSignedIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
    }
};
class App extends Component{
    constructor(props){
        super(props);
        this.state = initState;
    }
    /*TODO: Remove Proxy in package when go live */


    calculateFaceLocation = (data) =>{
     const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
     const image = document.getElementById('inputImage');
     const width =  Number(image.width);
     const height = Number(image.height);

        return{
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
        }
    };

    displayFaceBox = (box)=>{
        this.setState({box : box})
    };

    loadUser = (data) => {
        this.setState( {user : {
                id: data.id,
                name: data.name,
                email: data.email,
                entries: 0,
                joined: data.joined
            }});
    };

    onInputChange = (event) =>{
        this.setState({input:event.target.value})
    };

    onButtonSubmit = () => {
        this.setState({imageUrl:this.state.input});
        fetch('http://192.168.42.1:3000/imageUrl',{
            method:'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({
                input: this.state.input,
            })
        }).then(response => response.json())
            .then((response) =>{
                if(response){
                    fetch('http://192.168.42.1:3000/image',{
                        method:'PUT',
                        headers:{'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            id: this.state.user.id,
                        })
                    })
                        .then(res =>res.json())
                        .then(count => {
                            this.setState(Object.assign(this.state.user,{
                                entries: count
                            }))
                        })
                        .catch(console.log)
                }
                this.displayFaceBox(this.calculateFaceLocation(response))
            })
            .catch(err => console.log(err));
    };

    onRouteChange = (route) => {
        if (route === 'signOut'){
            this.setState(initState)
        }else if(route === 'home'){
            this.setState({ isSignedIn : true})
        }
        this.setState({route: route});

    };



    render() {
        const {isSignedIn, route, box, imageUrl} = this.state;
        return (
            <div className="App">
                <Particles className={'particles'}
                    params={particlesOptions} />
                <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
                {this.state.route === 'home' ?
                    <div>
                        <Logo/>
                        <Rank name = {this.state.user.name} entries = {this.state.user.entries}/>
                        < ImageLinkForm
                            onInputChange = {this.onInputChange}
                            onButtonSubmit = {this.onButtonSubmit}
                        />
                        <FaceRecognition  box = {box} imageUrl = {imageUrl}/>
                    </div>:
                    (
                        route === 'signIn' || route === 'signOut' ?
                            <SignIn loadUser ={this.loadUser} onRouteChange={this.onRouteChange}/>
                            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                    )
                }
            </div>
        );
    }
}

export default App;
