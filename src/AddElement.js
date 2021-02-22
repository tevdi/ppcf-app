import React from 'react'
import { Link } from 'react-router-dom'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState, ContentState, convertToRaw } from 'draft-js'

import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'

class AddElement extends React.Component{
  constructor(props) {
		super(props)
		this.state = {
			editorState: EditorState.createEmpty(),
			title: '',
			date: '',
			type: 'PrestaShop',
            typeid: 1,
			mode: 'add'
		}
    this.onEditorStateChange = this.onEditorStateChange.bind(this)
	}

	componentDidMount(){    
		const html = '<p style=\"text-align:center;\"><span style=\"color: rgb(0,0,0);font-size: 24px;font-family: Times New Roman;\"><strong>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet\"</strong></span></p>\n<p style=\"text-align:justify;\"><span style=\"font-size: 18px;font-family: Times New Roman;\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut mattis ante et dolor ultrices, in ornare ante accumsan. Duis dapibus leo eget risus luctus ornare. Praesent euismod pellentesque ligula. Vivamus aliquam tincidunt auctor. Proin sagittis neque ut interdum cursus. Fusce sed orci diam. Sed sed justo quis orci lobortis sagittis. Nullam augue libero, aliquet ac sagittis et, elementum eu odio. Curabitur interdum, leo a cursus fringilla, leo augue laoreet orci, non volutpat arcu felis facilisis urna. Curabitur consectetur diam at risus commodo cursus id at est. Cras et pulvinar mi. Praesent leo libero, mattis sed aliquet sed, ullamcorper vel justo. Duis porttitor arcu vel imperdiet accumsan:</span></p>\n<pre style=\"text-align:justify;\"><span style=\"font-size: 18px;font-family: Times New Roman;\">Maecenas elementum in purus et ultricies.<br><br>Aliquam aliquam tristique mauris, id volutpat sem consectetur volutpat.<br>Vestibulum ut elit vel tellus fermentum fringilla in in dui.</span></pre>\n<p><span style=\"font-size: 18px;font-family: Times New Roman;\">Vivamus in mauris turpis. Duis blandit eleifend justo. Aliquam bibendum laoreet ante a maximus. Nullam aliquam dolor at dolor laoreet, id placerat eros finibus. Ut in volutpat turpis. Aenean dapibus mi in turpis vulputate convallis. Sed pellentesque tempor est quis cursus. Suspendisse nisl urna, maximus non condimentum eget, eleifend vel odio. Donec a odio ac orci euismod volutpat. Integer nec porta odio.</span></p>'
		const contentBlock = htmlToDraft(html)
		if (contentBlock) {
			const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
			const editorState = EditorState.createWithContent(contentState)
			this.setState({
				editorState
			})        
		}
  }

	extractDateYMD(date){
		if (date == ''){
			date = new Date()
			date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
		}
		const dateYear = date.split('T')
		return dateYear[0]          
	} 
           
	onEditorStateChange(editorState){
		this.setState({
			editorState
		})
	}

	handleChange(event){
        if (event.target.name === "typeid"){
        this.setState({type: event.target.options[event.target.selectedIndex].text});
        }
		this.setState({
			[event.target.name]: event.target.value
		})
	}

  submitChanges(event){
		event.preventDefault()        
        console.log(this.state)
		const element = {
			title: this.state.title,
			date: this.state.date,
			type: this.state.type,
			typeid: this.state.typeid,
			text: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
		}            
		
		console.log(element)
            if (this.state.mode == 'add'){
                fetch(process.env.API_REST_URL+'/rest/data/insertElement', {                
                    method: 'post',
                    body: JSON.stringify({
                        element
                    })
                })
                .then(this.handleErrors)
                .then(response => {
                    alert('Element added SUCCESSFULLY.')
                })
                .catch(error => alert('ERROR adding the element: \n\n'+error))                
            } else {                
                fetch(process.env.API_REST_URL+'/rest/data/editElement/'+this.props.match.params.id, {                
                    method: 'post',
                    body: JSON.stringify({
                        element
                    })
                })
                .then(this.handleErrors)
                .then(response => {
                    alert('Element edited SUCCESSFULLY.')
                })
                .catch(error => alert('ERROR adding the element: \n\n'+error))                                
            }		
  }

  render(){
		const { editorState } = this.state
		return (
		<div className="container">
			<div className="breadcrumb">
					<Link to="/">Home</Link>&nbsp;/ Add/Edit Element
			</div>
			<form onSubmit={this.submitChanges.bind(this)}>
				<input type="text" placeholder="Title..." name="title" value={this.state.title} onChange={this.handleChange.bind(this)}/>
				<input type="Date" name="date" value={this.extractDateYMD(this.state.date)} onChange={this.handleChange.bind(this)}/>
				<select name="typeid" value={this.state.typeid} onChange={this.handleChange.bind(this)}>
                    <option value="1">PrestaShop</option>
                    <option value="2">React</option>
                    <option value="3">JavaScript</option>
				</select>
				<Editor
					editorState={editorState}
					wrapperClassName="demo-wrapper"
					editorClassName="demo-editor"
					onEditorStateChange={this.onEditorStateChange}
				/>
				<input type="submit" value="Save" className="btn btn-info"/>
			</form>
		</div>
    )
  }
}

export default AddElement
