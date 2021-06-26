import React, { useContext ,useEffect,useState } from "react";
import stockContext from "../context/Context";
import amazonLogo from "../images/AMZN.svg";
import googleLogo from "../images/GOOGL.png";
import fbLogo from "../images/FB.png";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Herocard = () => {

    const { heroStock } = useContext(stockContext);

    const [ cards , setCards] = useState([]);

    useEffect(() => {
        async function data(){
            const arr = await heroStock
            setCards(arr)
        }
        data()
    },[heroStock])
    


    const handleOnDragEnd = async(result) => {
        if (!result.destination) return;
        const items = await [...cards];
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setCards(items); 
        
    }

    

    return(
        <div>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="hero-card-container" direction="horizontal">
                    {(provided) => (
                        <div className="hero-card-container" {...provided.droppableProps} ref={provided.innerRef}>
                            {cards.map((item, index) => {
                                return(
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {provided => (
                                            
                                            <div className="hero-card" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <h4>{item.symbol}</h4>
                                                {item.symbol === "AMZN.cx" && <img src={amazonLogo} alt="logo"></img>}
                                                {item.symbol === "GOOGL" && <img src={googleLogo} alt="logo"></img>}
                                                {item.symbol === "FB" && <img src={fbLogo} alt="logo"></img>}
                                                <h3>{Math.abs(item.price)} USD</h3>
                                            </div>
                                        )}
                                    </Draggable>
                                )
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                    
                </Droppable>
            </DragDropContext>
        </div>
    )
}

export default Herocard;