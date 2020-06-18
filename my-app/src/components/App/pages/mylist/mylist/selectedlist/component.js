import responsiveBlockMaker from '../../../../../../util/responsiveBlock';
import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import { SwipeableList, SwipeableListItem } from '@sandstreamdev/react-swipeable-list';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';


export default function ({elq}) {

    const ResponsiveBlock = responsiveBlockMaker({elq: elq});

    function SelectedListComponent({size, list, selectedListId, setList}) {
        const isSmall = size === 'small';
        const [tasks, setTask] = useState(list.list);
        const [emptyItemFocus, setEmptyItemFocus] = useState(null);

        function setTasks(value, id, field) {
            const updatedTaskList = tasks.map(function (task) {
                if (task.id === id) {
                    task[field] = value;
                    return task;
                }
                return task;
            });
            setTask(updatedTaskList);
            setList(updatedTaskList, selectedListId);
        }

        function addEmptyItem() {
            const emptyTasks = _.find(tasks, (task) => task.name.length === 0);
            if (!emptyTasks) {
                setTask(tasks.concat({
                    id: _.uniqueId(Date.now()),
                    name: '',
                    isDone: false
                }));
            }
        }

        function deleteTaskById(item) {
            const updatedTaskList = tasks.filter(function (task) {
                return task.id !== item.id;
            });
            setList(updatedTaskList, selectedListId);
            setTask(updatedTaskList);
        }

        function swipeLeftOptions(item) {
            return {
                content: <div/>,
                action: () => deleteTaskById(item)
            }
        }

        const formStyle = function () {
            return {
                borderBottom:'1px solid black',
                display: 'flex',
                padding: '10px'
            }
        };

        useEffect(function () {
            if (emptyItemFocus) {
                emptyItemFocus.focus();
            }
        },[emptyItemFocus]);

        return (
            <form onSubmit={function (event) {
                event.preventDefault();
                addEmptyItem();
            }}>
                <div style={{width: isSmall ? '100%' : '70%'}}>
                    <div style={{display: 'flex', width:'100%'}}>
                        <div>
                            <h1>{list.name}</h1>
                        </div>
                        {tasks.length === 0 ? <div style={{marginLeft: "auto"}}>
                            <button
                                style={{border: 'none', backgroundColor: 'transparent'}}
                                onClick={function (event) {
                                    event.preventDefault();
                                    addEmptyItem();
                                }}>
                                <FontAwesomeIcon style={{fontSize: '50px'}} icon={faPlusCircle}/>
                            </button>
                        </div> : null}
                    </div>
                    <SwipeableList style={{listStyle: 'none'}}>
                        {tasks.sort(function (item1, item2) {
                            return item1.isDone - item2.isDone;
                        }).map(function (item, index) {
                            return (
                                <SwipeableListItem
                                    key={index}
                                    swipeLeft={swipeLeftOptions(item)}>
                                    <div>
                                        <div className='form-group' style={formStyle()}>
                                            <div style={{display: 'inline-flex', width: '100%'}}>
                                                <input value={item.name}
                                                       onChange={function (event) {
                                                           setTasks(event.target.value, item.id, 'name')
                                                       }}
                                                       style={{
                                                           backgroundColor: 'transparent',
                                                           border: 'none',
                                                           width: '100%',
                                                           fontSize: '24px'
                                                       }}
                                                       ref={function (ref) {
                                                           if (item.name.length === 0) {
                                                               setEmptyItemFocus(ref);
                                                           }
                                                       }}
                                                />
                                            </div>
                                            <div style={{
                                                marginLeft: 'auto',
                                                marginBottom: '10px'
                                            }} className='checkbox'>
                                                <input type='checkbox'
                                                       tabIndex='-1'
                                                       id={'checkbox' + item.id}
                                                       name='isDone'
                                                       onChange={function (event) {
                                                           setTasks(event.target.checked, item.id, 'isDone');
                                                       }}
                                                       checked={item.isDone}/>
                                                <label htmlFor={'checkbox' + item.id}>
                                                </label>
                                            </div>
                                            <input style={{display: 'none'}} type='submit'/>
                                        </div>
                                    </div>
                                </SwipeableListItem>
                            )
                        })}

                    </SwipeableList>
                </div>
            </form>
        );
    }

    return function (props) {
        const sizeBreakpoints = {
            small: 0,
            large: 700
        };

        return (
            <ResponsiveBlock sizeBreakpoints={sizeBreakpoints}>
                <SelectedListComponent {...props}/>
            </ResponsiveBlock>
        )
    }
}
