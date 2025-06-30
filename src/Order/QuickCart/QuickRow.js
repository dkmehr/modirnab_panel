import { useState, useEffect } from "react";
import ErrorAction from "../../components/Modal/ErrorAction";
import env, { normalPriceCount, payValue, normalPriceRound } from "../../env";
import DataModal from "../../components/Modal/dataModal";
import QuickOff from "./QuickOff";
import QuickCounter from "./QuickCounter";
import PostReq from "../../utils/PostReq";
function QuickRow(props) {
  const data = props.data;
  const token = props.token;
  const user = props.user;
  const tab = props.tab;
  const type = props.cart && props.cart.isQuote && props.cart.isQuote;
  const LiveCount = props.LiveCount;
  const setLiveCount = props.setLiveCount;
  const setTab = props.setTab ?? props.setTab;
  const ErrorAmount = props.ErrorAmount;
  const [showDesc, setShowDesc] = useState(0);
  const [editMode, setEditMode] = useState(0);
  const [changes, setChanges] = useState();
  const [Amount, setAmount] = useState("");

  const [AmountState, setAmountState] = useState(false);
  if (type == true) {
    setTab(true);
  }
  const fetchAmount = async (sku) => {
    setEditMode(1);
    const result = await PostReq({
      method: "Post",
      url: "/panel/faktor/calc-count",
      body: { sku: sku, stockId: props.cart.stockId },
    });
    setLiveCount(true);
    setAmount("");
    setTimeout(() => setAmount(result.count.quantity), 200);
  };
  console.log(LiveCount);
  const updateField = (changes) => {
    console.log(tab);
    if (!changes) return;

    const postOptions = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token && token.token,
        userId: token && token.userId,
      },
      body: JSON.stringify({
        userId: user
          ? user.Code
            ? user.Code
            : user._id
          : token && token.userId,
        cartNo: props.cartNo,
        cartID: data.id,
        changes,
      }),
    };

    fetch(
      env.siteApi +
        (props.cartNo
          ? `/panel/${tab ? "quote" : "faktor"}/update-Item-cart`
          : `/panel/${tab ? "quote" : "faktor"}/update-Item`),
      postOptions
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.error) {
            props.setError({ message: result.error, color: "brown" });
            setTimeout(
              () => props.setError({ message: "", color: "brown" }),
              3000
            );
          } else {
            props.setCart(result);
            props.setError({ message: result.message, color: "orange" });
            setTimeout(
              () => props.setError({ message: "", color: "brown" }),
              3000
            );
          }
        },
        (error) => {
          console.log(error);
        }
      );
  };

  const [showRemove, setShowRemove] = useState();
  const removeItem = () => {
    const postOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token && token.token,
        userId: token && token.userId,
      },
      body: JSON.stringify({
        userId: user
          ? user.Code
            ? user.Code
            : user._id
          : token && token.userId,
        cartID: data._id,
      }),
    };
    console.log(postOptions);
    fetch(
      env.siteApi + `/panel/${tab ? "quote" : "faktor"}/remove-cart`,
      postOptions
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.error) {
            props.setError({ message: result.error, color: "brown" });
            setTimeout(
              () => props.setError({ message: "", color: "brown" }),
              3000
            );
          } else {
            props.setCart(result);
            props.setError({ message: result.message, color: "orange" });
            setTimeout(
              () => props.setError({ message: "", color: "brown" }),
              3000
            );
          }
        },
        (error) => {
          console.log(error);
        }
      );
  };
  const defAction = () => {
    props.action({ cartID: data.id });
  };
  const saveChanges = () => {
    updateField(changes);
    console.log(changes);
    setEditMode(0);
  };

  useEffect(() => {
    if (ErrorAmount && ErrorAmount.filter((l) => l.sku === data.sku).length) {
      setAmountState(true);
    } else {
      setAmountState(false);
    }
  }, [ErrorAmount]);

  return (
    <>
      <tr className={`product-tr ${AmountState ? "red-bg" : ""}`}>
        <td data-cell="ردیف">
          <p>{props.index}</p>
        </td>

        <td data-cell="شرح کالا">
          <div className="product-title">
            <div className="product-name">
              <p className="name">{data.title}</p>
              <p>{data.sku}</p>
            </div>
          </div>
        </td>

        <td data-cell="مبلغ واحد">
          {editMode ? (
            <input
              type="text"
              placeholder="قیمت واحد"
              value={changes ? changes.price : data.price}
              className="price-edit-input"
              onChange={(e) =>
                setChanges((prevState) => ({
                  ...prevState,
                  price: e ? e.target.value : "",
                }))
              }
            />
          ) : (
            <p>{normalPriceCount(data.price)}</p>
          )}
        </td>
        <td data-cell="تخفیف">
          {editMode ? (
            <div className="input-tr">
              <QuickOff
                change={(e) =>
                  setChanges((prevState) => ({
                    ...prevState,
                    discount: e,
                  }))
                }
                discount={changes ? changes.discount : data.discount}
                def={data.discount}
              />
            </div>
          ) : (
            <div className="discount-td">
              <p>
                {data.total && data.total.discount}
                {parseInt(data.total && data.total.discount) < 100 ? "%" : ""}
              </p>
              <span className="total-discount">
                {props.cart &&
                props.cart.discount &&
                props.cart.discount !== "0"
                  ? "+" + props.cart.discount + "%"
                  : ""}
              </span>
            </div>
          )}
        </td>
        <td data-cell="مبلغ کل">
          <p>{normalPriceCount(data.total && data.total.price)}</p>
        </td>
        <td>
          {editMode ? (
            <div className="more-btn">
              <i className="fa-solid fa-save" onClick={saveChanges}></i>
              <i
                className="fa-solid fa-remove"
                onClick={() => setEditMode(0)}
              ></i>
            </div>
          ) : (
            <div className="more-btn">
              <i
                className="fa-solid fa-comment"
                onClick={() => setShowDesc(1)}
              ></i>
              {props.canEdit ? (
                <>
                  {/* <i
                    className="fa-solid fa-pen"
                    onClick={() => fetchAmount(data.sku)}
                  ></i> */}
                  {data.stock ? (
                    <i
                      className="fa-solid fa-sign-out storeSelect"
                      onClick={() => updateField({ stock: "" })}
                    ></i>
                  ) : (
                    <i
                      className="fa-solid fa-sign-out"
                      onClick={() => updateField({ stock: "9" })}
                    ></i>
                  )}
                  <i
                    className="fa-solid fa-trash"
                    style={{ color: "red" }}
                    onClick={() => setShowRemove(1)}
                  ></i>
                </>
              ) : (
                <></>
              )}
            </div>
          )}
        </td>
      </tr>
      {showRemove ? (
        <ErrorAction
          status={"DELETE"}
          title={"حذف آیتم"}
          text={"آیتم انتخاب شده حذف خواهد شد. آیا مطمئن هستید؟"}
          linkText={""}
          style={{ direction: "rtl" }}
          buttonText="حذف"
          close={() => setShowRemove()}
          color="red"
          action={() => (props.action ? defAction() : removeItem())}
        />
      ) : (
        <></>
      )}
      {showDesc ? (
        <DataModal
          action={(e) => updateField({ description: e })}
          close={() => setShowDesc(0)}
          color="darkblue"
          buttonText="تغییر توضیحات"
          def={data.description}
          title={"تغییر توضیحات"}
        />
      ) : (
        <></>
      )}
    </>
  );
}
export default QuickRow;
