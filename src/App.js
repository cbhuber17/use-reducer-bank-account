import "./styles.css";
import { useReducer } from "react";

/*
INSTRUCTIONS / CONSIDERATIONS:

1. Let's implement a simple bank account! It's similar to the example that I used as an analogy to explain how useReducer works, but it's simplified (we're not using account numbers here)

2. Use a reducer to model the following state transitions: openAccount, deposit, withdraw, requestLoan, payLoan, closeAccount. Use the `initialState` below to get started.

3. All operations (expect for opening account) can only be performed if isActive is true. If it's not, just return the original state object. You can check this right at the beginning of the reducer

4. When the account is opened, isActive is set to true. There is also a minimum deposit amount of 500 to open an account (which means that the balance will start at 500)

5. Customer can only request a loan if there is no loan yet. If that condition is met, the requested amount will be registered in the 'loan' state, and it will be added to the balance. If the condition is not met, just return the current state

6. When the customer pays the loan, the opposite happens: the money is taken from the balance, and the 'loan' will get back to 0. This can lead to negative balances, but that's no problem, because the customer can't close their account now (see next point)

7. Customer can only close an account if there is no loan, AND if the balance is zero. If this condition is not met, just return the state. If the condition is met, the account is deactivated and all money is withdrawn. The account basically gets back to the initial state
*/

const initialState = {
  balance: 0,
  loan: 0,
  isActive: false,
};

const depositAmount = 150;
const withdrawAmount = 50;
const loanAmount = 500;

function reducer(state, action) {
  switch (action.type) {
    case "openAccount":
      return { ...state, isActive: true };

    case "deposit":
      return { ...state, balance: state.balance + depositAmount };

    case "withdraw":
      return {
        ...state,
        balance: state.balance - withdrawAmount,
      };

    case "getLoan":
      return {
        ...state,
        balance: state.balance + loanAmount,
        loan: state.loan + loanAmount,
      };

    case "payLoan":
      return {
        ...state,
        balance: state.balance - loanAmount,
        loan: state.loan - loanAmount,
      };

    case "closeAccount":
      return { ...initialState };

    default:
      throw new Error(`Action ${action.type} unknown`);
  }
}

export default function App() {
  const [{ balance, loan, isActive }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const haveLoan = loan === 0 ? false : true;

  return (
    <div className="App">
      <h1>useReducer Bank Account</h1>
      <p>Balance: {balance}</p>
      <p>Loan: {loan}</p>

      <p>
        <button
          onClick={() => dispatch({ type: "openAccount" })}
          disabled={isActive ? true : false}
        >
          Open account
        </button>
      </p>
      <p>
        <Button
          dispatch={dispatch}
          type="deposit"
          disabledCriteria={isActive ? false : true}
        >
          Deposit {depositAmount}
        </Button>
      </p>
      <p>
        <Button
          dispatch={dispatch}
          type="withdraw"
          disabledCriteria={
            balance - withdrawAmount >= 0 && isActive ? false : true
          }
        >
          Withdraw {withdrawAmount}
        </Button>
      </p>
      <p>
        <Button
          dispatch={dispatch}
          type="getLoan"
          disabledCriteria={isActive ? false : true}
        >
          Request a loan of {loanAmount}
        </Button>
      </p>
      <p>
        <Button
          dispatch={dispatch}
          type="payLoan"
          disabledCriteria={
            balance >= loan && isActive && haveLoan ? false : true
          }
        >
          Pay loan
        </Button>
      </p>
      <p>
        <Button
          dispatch={dispatch}
          type="closeAccount"
          disabledCriteria={
            isActive && balance === 0 && loan === 0 ? false : true
          }
        >
          Close account
        </Button>
      </p>
    </div>
  );
}

function Button({ dispatch, type, disabledCriteria, children }) {
  return (
    <button onClick={() => dispatch({ type })} disabled={disabledCriteria}>
      {children}
    </button>
  );
}
