import responsiveBlockMaker from '../../../../../util/responsiveBlock';
import React, {useState} from 'react';
import SelectedListMaker from './selectedlist/component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function ({elq}) {

    const ResponsiveBlock = responsiveBlockMaker({elq: elq});

    function ListComponent(props) {
        const SelectedList = SelectedListMaker({elq});
        const [lists, setLists] = useState(props.lists);
        const isSmall = props.size === 'small';

        function updateLists(listId, field, value) {
            const updatedLists = lists.map(function (list) {
                if (list.listId === listId) {
                    list.list[field] = value;
                    return list;
                }
                return list;
            });
            setLists(updatedLists);
            props.updateListName(listId, value);
        }

        function addList() {
            props.createNewList();
        }

        function deleteList(listId) {
            const updatedLists = lists.filter(function (list) {
                return list.listId !== listId;
            });
            setLists(updatedLists);
            props.deleteList(listId);
        }

        const formStyle = function () {
            return {
                borderBottom:'1px solid black',
                display: 'flex',
                padding: '10px',
                width: '100%'
            }
        };

        return (
            <React.Fragment>
                <div style={{width: isSmall ? '100%' : '70%', margin: 'auto'}}>
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    {!props.chosenList ?
                        <div style={{display: 'flex', width:'100%'}}>
                            <div style={{marginLeft: 'auto'}}>
                                <button style={{backgroundColor:'transparent', border: 'none'}}
                                        onClick={function (event) {
                                            event.preventDefault();
                                            addList();
                                        }}>
                                    Add list +
                                </button>
                            </div>
                        </div> : null }
                    {!props.chosenList ? lists.map(function (list, index) {
                            return (
                                <div key={index}>
                                    <div className='form-group' style={formStyle()}>
                                        <div style={{display: 'inline-flex'}}>
                                            <button style={{backgroundColor:'transparent', border: 'none'}} onClick={function (event) {
                                                event.preventDefault();
                                                props.setChosenList(list);
                                            }}>
                                                <FontAwesomeIcon style={{fontSize: '30px', color: 'green'}} icon={faListAlt}/>
                                            </button>
                                            <input value={list.list.name}
                                                   onChange={function (event) {
                                                       updateLists(list.listId, 'name', event.target.value);
                                                   }}
                                                   style={{
                                                       backgroundColor: 'transparent',
                                                       border: 'none',
                                                       width: '100%',
                                                       fontSize: '24px'
                                                   }}/>
                                        </div>
                                        <div style={{marginLeft: 'auto'}}>
                                            <button style={{backgroundColor: 'transparent', border: 'none'}} onClick={function (event) {
                                                event.preventDefault();
                                                deleteList(list.listId);
                                                props.deleteList(list.listId);
                                            }}>
                                                <FontAwesomeIcon style={{fontSize: '20px', color: 'crimson'}} icon={faTrash}/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }) :
                        <React.Fragment>
                            <SelectedList list={props.chosenList.list} selectedListId={props.chosenList.listId} {...props}/>
                            <button style={{backgroundColor: 'transparent', border: 'none'}}
                                    onClick={function (event) {
                                        event.preventDefault();
                                        props.setChosenList(null);
                                    }}>
                                Back to lists
                            </button>
                        </React.Fragment>
                    }
                </div>
            </React.Fragment>
        );
    }

    return function List(props) {
        const sizeBreakpoints = {
            small: 0,
            large: 700
        };

        return (
            <ResponsiveBlock sizeBreakpoints={sizeBreakpoints}>
                <ListComponent {...props}/>
            </ResponsiveBlock>
        )
    }
}
