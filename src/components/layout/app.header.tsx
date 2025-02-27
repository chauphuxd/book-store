import { useCurrentApp } from "components/context/app.context";
import './app.header.scss'
import logo from 'assets/Hiệu-sách-Cửa-hàng-Etsy-Biểu-tượng.svg'
import { CiShoppingCart } from "react-icons/ci";
import { FaUserAlt } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { Button, Dropdown, Empty, Input, MenuProps, Popover } from 'antd';
import { Avatar, Badge, Space } from 'antd';
import { Link } from "react-router-dom";
import { logoutAPI } from "services/api";
import { useNavigate } from "react-router";
import { useState } from "react";
import ManageAccount from "components/client/account";


interface IProps {
  searchTerm: string,
  setSearchTerm: (v: string) => void
}

const AppHeader = (props: IProps) => {
  const navigate = useNavigate();

  const { user, setUser, isAuthenticated, setIsAuthenticated, carts, setCarts } = useCurrentApp();

  const [openManageAccount, setOpenManageAccount] = useState<boolean>(false);


  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`

  const handleLogout = async () => {
    const res = await logoutAPI();
    if (res.data) {
      setUser(null);
      setCarts([])
      setIsAuthenticated(false)
      localStorage.removeItem("access_token")
      localStorage.removeItem("carts")
    }
  }

  const items: MenuProps['items'] = [
    {
      label: <label style={{ cursor: "pointer" }} onClick={() => setOpenManageAccount(true)}>
        Quản lý tài khoản
      </label>,
      key: 'account',
    },
    {
      label: <label style={{ cursor: "pointer" }} >
        <Link style={{ color: '#000' }} to="/history"> Lịch sử mua hàng </Link>
      </label>,
      key: '2',
    }, {
      label: <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
        Đăng xuất
      </label>,
      key: 'logout',
    },
  ];

  if (user?.role === 'ADMIN') {
    items.unshift({
      label: <Link to="/admin">Trang quản trị </Link>,
      key: 'admin',
    })
  }

  const contentPopover = () => {
    return (
      <div className="pop-cart-body">
        <div className="pop-cart-content">
          {carts?.map((book, index) => {
            return (
              <div className='book' key={`book-${index}`}>
                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`} />
                <div>{book?.detail?.mainText}</div>
                <div className='price'>
                  {
                    new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(book?.detail?.price)
                  }
                </div>
              </div>
            )
          })}
        </div>
        {carts.length > 0 ? (
          <div className="pop-cart-footer">
            <button onClick={() => navigate("/order")}>Xem giỏ hàng</button>
          </div>
        ) : (
          <Empty description="Không có sản phẩm trong giỏ hàng" />
        )}

      </div>
    )
  }




  return (
    <>
      <header>
        <header className="header">
          <div className="header__logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>

            <img src={logo} style={{ width: '40px', height: '40px' }} />
            {/* <span>Book Store</span> */}

          </div>
          <div className="header__search">
            <Input value={props.searchTerm} onChange={(e) => props.setSearchTerm(e.target.value)} size="large" placeholder="Hôm nay bạn kiếm gì" prefix={<IoIosSearch style={{ color: "#007bff", fontSize: "18px" }} />} />
          </div>

          <Popover placement="topRight"
            className="popover-carts"
            rootClassName="popover-carts"
            title={"Sản phẩm thêm mới"}
            content={contentPopover}
            arrow={true}
          >
            <Badge count={carts?.length ?? 0} size="small" >
              <CiShoppingCart style={{ fontSize: "27px", color: "#007bff", cursor: 'pointer' }} />
            </Badge>
          </Popover>

          <div className="header__info">
            {isAuthenticated ? <img src={urlAvatar} style={{ marginRight: '10px', fontSize: "20px", color: "#001632", width: "40px", height: "40px", borderRadius: '999px', objectFit: 'cover' }} /> : <FaUserAlt style={{ fontSize: "20px", marginRight: "10px", }} />}

            {isAuthenticated ?
              <Dropdown menu={{ items }} trigger={['click']} placement="bottom">
                <a onClick={(e) => e.preventDefault()}>
                  <Space style={{ color: "rgb(151 151 151)" }}>
                    {user?.fullName}
                  </Space>
                </a>
              </Dropdown> : <div > <Link to="/login" style={{ color: "#000" }}>Tài khoản</Link> </div>
            }
          </div>
        </header>
      </header>

      <ManageAccount isModalOpen={openManageAccount} setIsModalOpen={setOpenManageAccount} />

    </>
  );
}
export default AppHeader;