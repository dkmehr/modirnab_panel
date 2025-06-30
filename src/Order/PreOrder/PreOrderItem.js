import { useState } from "react";
import env, {
  PriceDiscountTax,
  TAX,
  normalPriceCount,
  normalPriceRound,
} from "../../env";
import tabletrans from "../../translate/tables";
function PreOrderItem(props) {
  const token = props.token;
  const data = props.data;
  const [showDetail, setDetail] = useState(0);
  const [LinkShare, setLinkShare] = useState("");
  const [ShowReorder, setShowReorder] = useState(0);
  const [PayValue, setPayValue] = useState();

  //console.log(data.userData)
  const CreateLink = () => {
    const postOptions = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token && token.token,
        userId: token && token.userId,
      },
      body: JSON.stringify({ cartNo: data.cartNo }),
    };
    fetch(env.siteApi + "/panel/faktor/create-public-link", postOptions)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          setLinkShare("/public-print/" + data.cartNo);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  return (
    <div className="order-wrapper">
      <div
        className="border-title"
        // onClick={() => (showDetail ? setDetail(0) : setDetail(1))}
      >
        <div className="bu-name">
          {data ? (
            <div className="col">
              <p>{data.cName ? data.cName : "-"}</p>
              {/* <span>
                {data.userInfo[0].meliCode
                  ? data.userInfo[0].meliCode
                  : "----------"}
                <i
                  className="fa-solid fa-credit-card no-font"
                  aria-hidden="true"
                ></i>
              </span> */}
              <span>
                {data.phone ? data.phone : "----------"}
                <i className="fa-solid fa-phone no-font" aria-hidden="true"></i>
              </span>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="newCol" style={{}}>
          <p>شماره سفارش: {data.faktorNo}</p>

          {/*<p>{normalPriceCount(total.totalPrice,1)}</p>*/}
        </div>
        <div className="newCol">
          <small>
            مبلغ کل:{" "}
            <strong>{data ? normalPriceCount(data.totalPrice) : "-"}</strong>
          </small>
          <div className="col">
            <p>تعداد: {data ? data.totalCount : 1}</p>
          </div>
        </div>
        <div className="newCol">
          <small>
            تاریخ: {new Date(data.initDate).toLocaleDateString("fa")}
          </small>
          <small>
            ساعت: {new Date(data.initDate).toLocaleTimeString("fa")}
          </small>
        </div>
        <div className="newCol">
          {data.description ? <small>توضیحات: </small> : <></>}
          <small>{data.description}</small>
        </div>
        <div class="btn-wrapper">
          <i
            className="tableIcon fas fa-print"
            onClick={() =>
              window.open("/orders/print/" + data.cartNo, "_blank")
            }
          ></i>
          <i
            className="tableIcon fas fa-paper-plane"
            onClick={() => CreateLink()}
          ></i>
          <i
            class="fa fa-refresh"
            aria-hidden="true"
            onClick={() => setShowReorder(data.cartNo)}
          ></i>
        </div>
        <i
          className={
            showDetail ? "fa-solid fa-angle-up" : "fa-solid fa-angle-down"
          }
        ></i>
      </div>
      {showDetail ? (
        <div className="product-table-sec display-on height-on">
          <table>
            <thead>
              <tr>
                <th data-cell="ردیف">
                  <p>ردیف</p>
                </th>
                <th>
                  <p>{tabletrans.productName["persian"]}</p>
                </th>
                <th>
                  <p>{tabletrans.brand["persian"]}</p>
                </th>
                <th>
                  <p>{tabletrans.model["persian"]}</p>
                </th>
                <th>
                  <p>{tabletrans.color["persian"]}</p>
                </th>
                <th>
                  <p>{tabletrans.km["persian"]}</p>
                </th>
                <th>
                  <p>{tabletrans.gear["persian"]}</p>
                </th>
                <th>
                  <p>{tabletrans.bodyColor["persian"]}</p>
                </th>
                <th>
                  <p>{tabletrans.enterDate["persian"]}</p>
                </th>
                <th>
                  <p>{tabletrans.ensurence["persian"]}</p>
                </th>
                <th>
                  <p>{tabletrans.branch["persian"]}</p>
                </th>

                <th>
                  <p>70%</p>
                </th>
                <th>
                  <p>{tabletrans.price["persian"]}</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.cartItems &&
                data.cartItems.map((item, i) => (
                  <tr key={i}>
                    <td data-cell="ردیف">
                      <p>{i + 1}</p>
                    </td>
                    <td data-cell="شرح کالا">
                      <div className="product-title">
                        <div className="product-name">
                          <p className="name">{item.productDetail[0].title}</p>
                          <p className="email">{item.sku}</p>
                        </div>
                      </div>
                    </td>

                    <td data-cell="برند">
                      <p>{item.productDetail[0].brand}</p>
                    </td>

                    <td data-cell="مدل">
                      <p>{item.productDetail[0].model}</p>
                    </td>
                    <td data-cell="رنگ">
                      <p>
                        {item.productDetail[0].filters &&
                          item.productDetail[0].filters.color}
                      </p>
                    </td>
                    <td data-cell="کارکرد">
                      <p>{item.productDetail[0].km}</p>
                    </td>
                    <td data-cell="گیربکس">
                      <p>
                        {item.productDetail[0].filters &&
                          item.productDetail[0].filters.gear}
                      </p>
                    </td>
                    <td data-cell="رنگشدگی">
                      <p>{item.productDetail[0].description}</p>
                    </td>
                    <td data-cell="تاریخ ورود">
                      <p>{item.productDetail[0].enterDate}</p>
                    </td>
                    <td data-cell="بیمه">
                      <p>{item.productDetail[0].bimeDate}</p>
                    </td>
                    <td data-cell="شعبه">
                      <p>
                        {item.productDetail[0].filters &&
                          item.productDetail[0].filters.branch}
                      </p>
                    </td>
                    <td data-cell="70%">
                      <p>
                        {normalPriceCount(
                          Math.ceil(Number(item.price ? item.price : 0) * 0.7)
                        )}
                      </p>
                    </td>
                    <td data-cell="قیمت">
                      <p>{normalPriceCount(item.price)}</p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <></>
      )}
      {/* {LinkShare ? (
        <LinkModal LinkShare={LinkShare} setLinkShare={setLinkShare} />
      ) : (
        <></>
      )} */}
      {/* {ShowReorder ? (
        <ReorderModal
          ShowReorder={ShowReorder}
          setShowReorder={setShowReorder}
          setPayValue={setPayValue}
          cartNo={ShowReorder}
        />
      ) : (
        <></>
      )} */}
    </div>
  );
}
export default PreOrderItem;
