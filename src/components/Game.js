import React, { useEffect } from 'react';
import styled from 'styled-components';

import useInterval from '../hooks/use-interval-hook'
import cookieSrc from '../cookie.svg';

const items = [
  { id: 'cursor', name: 'Cursor', cost: 10, value: 1 },
  { id: 'grandma', name: 'Grandma', cost: 100, value: 10 },
  { id: 'farm', name: 'Farm', cost: 1000, value: 80 },
];

//PURCHASING ITEMS
const purchase = (numCookies, setNumCookies, purchasedItems, setPurchasedItems, itemToBuy) => {
  if (numCookies >= itemToBuy.cost) {
    setNumCookies(numCookies - itemToBuy.cost);
    let tempPurchase = purchasedItems;
    tempPurchase[itemToBuy.id]++;
    setPurchasedItems(tempPurchase);
  }
}

//MAKES STORE ITEMS
const ItemMake = ({numCookies, setNumCookies, purchasedItems, setPurchasedItems, item, index}) => {
  //focus first item on page load
  //map is external as useRef cannot be in a callback
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (index === 0) {
      ref.current.focus();
    }
  }, [index]);

  return (
    <StyledItem 
    key={item.id}
    ref={ref}
    onClick={()=>purchase(numCookies, setNumCookies, purchasedItems, setPurchasedItems, item)}
    >
      <h2>{item.name}</h2>
      <p>
      Cost: <span>{item.cost} cookie(s)</span>, 
      Produces <span>{item.value}</span> cookies/second.
      </p>
      <h2>{purchasedItems[item.id]}</h2>
    </StyledItem>
  )
}

//COOKIES PER SECOND
const cookiesPerSec = ({purchasedItems}) => {
  let sum = 
  (purchasedItems.cursor) + 
  (purchasedItems.grandma * 10) + 
  (purchasedItems.farm * 80);
  return sum;
}

const Game = () => {

  const [numCookies, setNumCookies] = React.useState(10000);
  const [purchasedItems, setPurchasedItems] = React.useState({
    cursor: 0,
    grandma: 0,
    farm: 0,
  });



//cookie count updater
  useInterval(() => {
    const numOfGeneratedCookies = cookiesPerSec({purchasedItems});
    setNumCookies(numCookies + numOfGeneratedCookies);
  }, 1000);
//title count updater
  useEffect(()=>{
    document.title = numCookies + ' Cookies!';
    return ()=>{document.title = `Cookie Clickaarr Workshop`};
  }, [numCookies]);
//spacebar to click cookie
  useEffect(()=>{
    const handleKeydown = (ev) => {
      ev.preventDefault();
      if (ev.repeat) { return };
      if (ev.code === 'Space') {
        setNumCookies(numCookies + 1);
        console.log('space');
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => {window.removeEventListener('keydown', handleKeydown);}
  });

  return (
    <StyledWrapper>
      <StyledGameArea>
        <Indicator>
          <Total>{numCookies} cookies</Total>
          <p><strong>{cookiesPerSec({purchasedItems})}</strong> cookies per second</p>
        </Indicator>
        <StyledButton onClick= {()=>
          setNumCookies(numCookies + 1)}>
          <Cookie src={cookieSrc} />
        </StyledButton>
      </StyledGameArea>

      <ItemArea>
        <SectionTitle>Items:</SectionTitle>
        {items.map((item, index)=> {
          return (
            <ItemMake
            index={index}
            item={item} 
            numCookies={numCookies}
            setNumCookies={setNumCookies}
            purchasedItems={purchasedItems}
            setPurchasedItems={setPurchasedItems}
            />
          )
        })}
      </ItemArea>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  height: 100vh;
`;
const StyledGameArea = styled.div`
  flex: 1;
  display: grid;
  place-items: center;
`;

const StyledItem = styled.button`
  border: none;
  border-bottom: 1px solid gray;
  padding: 1rem;
  background: #222;
  color: whitesmoke;
  text-align: left;
  cursor: pointer;
  &:active {
    border: 3px solid lime;
  }
`;

const StyledButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  &:active {
    transform: scale(0.9);
  }
`;

const Cookie = styled.img`
  width: 200px;
`;

const ItemArea = styled.div`
  height: 100%;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SectionTitle = styled.h3`
  text-align: center;
  font-size: 32px;
  color: yellow;
`;

const Indicator = styled.div`
  position: absolute;
  width: 250px;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
`;

const Total = styled.h3`
  font-size: 28px;
  color: lime;
`;

export default Game;
