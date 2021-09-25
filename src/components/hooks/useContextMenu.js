import { useEffect, useCallback, useState } from "react";

const useContextMenu = outerRef => {
  const [xPos, setXPos] = useState("0px");
  const [yPos, setYPos] = useState("0px");
  const [menu, showMenu] = useState(false);
  const [target, setTarget] = useState({})

  const handleContextMenu = useCallback(
    event => {
      event.preventDefault();
      let eventTarget;
      if (event.target.parentNode.parentNode) {
        eventTarget = event.target.parentNode.id ? event.target.parentNode : event.target.parentNode.parentNode.parentNode
      } else return
      if (!eventTarget.id || eventTarget.id === 'root') return
      setTarget({ type: eventTarget.classList.value.includes('folder') ? 'folder' : 'file' , id: eventTarget.id })
 
      if (outerRef && outerRef.current.contains(event.target)) {
        setXPos(`${event.pageX}px`);
        setYPos(`${event.pageY}px`);
        showMenu(true);
      } else {
        showMenu(false);
      }
    },
    [showMenu, outerRef, setXPos, setYPos]
  );

  const handleClick = useCallback(() => {
    showMenu(false);
  }, [showMenu]);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.addEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });
  
  return { xPos, yPos, menu, target };
};

export default useContextMenu;
