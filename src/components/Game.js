import React, { useEffect } from 'react';
import styled from 'styled-components';

import useInterval from '../hooks/use-interval-hook'
import cookieSrc from '../cookie.svg';

const items = [
  { id: 'cursor', name: 'Cursor', cost: 10, value: 1 },
  { id: 'grandma', name: 'Grandma', cost: 100, value: 10 },
  { id: 'farm', name: 'Farm', cost: 1000, value: 80 },
];

const purchase = (numCookies, setNumCookies, purchasedItems, setPurchasedItems, itemToBuy) => {
  if (numCookies >= itemToBuy.cost) {
    console.log('buy ' + itemToBuy.id);
    setNumCookies(numCookies - itemToBuy.cost);
    let tempPurchase = purchasedItems;
    tempPurchase[itemToBuy.id]++;
    setPurchasedItems(tempPurchase);
  }
}

const ItemMake = ({numCookies, setNumCookies, purchasedItems, setPurchasedItems, items}) => {
  return (
    <>
    {items.map(item => {
      return (
      <StyledItem 
      key={item.id}
      onClick={()=>purchase(numCookies, setNumCookies, purchasedItems, setPurchasedItems, item)}
      >
        <h2>{item.name}</h2>
        <p>
        Cost: <span>{item.cost} cookie(s)</span>, 
        Produces <span>{item.value}</span> cookies/second.
        </p>
      </StyledItem>
      )
    })}
    </>
  )
}

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

  useInterval(() => {
    const numOfGeneratedCookies = cookiesPerSec({purchasedItems});
    setNumCookies(numCookies + numOfGeneratedCookies);
  }, 1000);

  useEffect(()=>{
    document.title=numCookies + ' Cookies!';
  }, [numCookies]);

  return (
    <StyledWrapper>
      <StyledGameArea>
        <Indicator>
          <Total>{numCookies} cookies</Total>
          <p><strong>{cookiesPerSec({purchasedItems})}</strong> cookies per second</p>
        </Indicator>
        <StyledButton onClick= {()=>setNumCookies(numCookies + 1)}>
          <Cookie src={cookieSrc} />
        </StyledButton>
      </StyledGameArea>

      <ItemArea>
        <SectionTitle>Items:</SectionTitle>
        <ItemMake 
        items={items} 
        numCookies={numCookies}
        setNumCookies={setNumCookies}
        purchasedItems={purchasedItems}
        setPurchasedItems={setPurchasedItems}
        />
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

const StyledItem = styled.div`
  border-bottom: 1px solid gray;
  padding: 1rem;
  &:focus {
    border: 3px solid lime;
  }
`;

const StyledButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
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
