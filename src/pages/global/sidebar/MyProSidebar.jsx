// docs https://github.com/azouaoui-med/react-pro-sidebar
import {useContext, useState} from "react";
import { Menu, Sidebar, MenuItem, SubMenu } from "react-pro-sidebar";
import { useProSidebar } from "react-pro-sidebar";
 
import { useSidebarContext } from "./sidebarContext";
 
import { AppContext } from "../../../context/AppContext";
 
import { Link } from "react-router-dom";
import { tokens } from "../../../theme";
import { useTheme, Box, Typography, IconButton } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SwitchRightOutlinedIcon from "@mui/icons-material/SwitchRightOutlined";
import SwitchLeftOutlinedIcon from "@mui/icons-material/SwitchLeftOutlined";
import LocationCityIcon from '@mui/icons-material/LocationCity';
import MapIcon from '@mui/icons-material/Map';
import PublicIcon from '@mui/icons-material/Public';
import BusinessIcon from '@mui/icons-material/Business';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
 
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import {QuestionMark} from "@mui/icons-material";

import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';

const Item = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
 
 
    return (
        <MenuItem
            active={selected === title}
            style={{ color: colors.grey[100] }}
            onClick={() => setSelected(title)}
            icon={icon}
            routerLink={<Link to={to} />}
        >
            <Typography>{title}</Typography>
        </MenuItem>
    );
};
 
const MyProSidebar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [selected, setSelected] = useState("Dashboard");
    const { sidebarRTL, setSidebarRTL, sidebarImage } = useSidebarContext();
    const { collapseSidebar, toggleSidebar, collapsed, broken } = useProSidebar();
    const isDark = theme.palette.mode === 'dark';
 
    const { userData } = useContext(AppContext);
 
    return (
 
        <Box
            sx={{
                position: "sticky",
                display: "flex",
                height: "100vh",
                top: 0,
                bottom: 0,
                zIndex: 10000,
                "& .sidebar": {
                    border: "none",
                },
                "& .menu-icon": {
                    backgroundColor: "transparent !important",
                },
                "& .menu-item": {
                    color: `${theme.palette.mode === 'dark' ? colors.greenAccent[500] : colors.grey[100]} !important`,
                    backgroundColor: "transparent !important",
                },
 
                "& .menu-anchor": {
                    color: `${isDark ? colors.greenAccent[500] : colors.grey[100]} !important`,
                    backgroundColor: "transparent !important",
                    transition: "color 0.2s ease",
                },
 
                "& .menu-anchor:hover": {
                    color: `${isDark ? colors.blueAccent[500] : colors.primary[700]} !important`,
                    backgroundColor: "transparent !important",
                },
 
                "& .menu-anchor.ps-active": {
                    color: `${colors.greenAccent[500]} !important`,
                },
 
                "& .menu-item:hover": {
                    color: `${colors.blueAccent[500]} !important`,
                    backgroundColor: "transparent !important",
                },
                "& .menu-item.active": {
                    color: `${colors.greenAccent[500]} !important`,
                    backgroundColor: "transparent !important",
                },
                "& .ps-submenu-content, & .sub-menu-content": {
                    backgroundColor: "transparent !important",
                    boxShadow: "none !important",
                    border: "none !important",
                    paddingLeft: "20px !important",
                },
                "& .ps-submenu-content .menu-item.active, & .sub-menu-content .menu-item.active": {
                    color: `${colors.blueAccent[500]} !important`, // blue active submenu item
                    backgroundColor: "transparent !important",
                },
            }}
        >
            <Sidebar
                breakPoint="md"
                rtl={sidebarRTL}
                backgroundColor={colors.primary[400]}
                image={sidebarImage}
            >
                <Menu iconshape="square">
                    <MenuItem
                        icon={
                            collapsed ? (
                                <MenuOutlinedIcon onClick={() => collapseSidebar()} />
                            ) : sidebarRTL ? (
                                <SwitchLeftOutlinedIcon
                                    onClick={() => setSidebarRTL(!sidebarRTL)}
                                />
                            ) : (
                                <SwitchRightOutlinedIcon
                                    onClick={() => setSidebarRTL(!sidebarRTL)}
                                />
                            )
                        }
                        style={{
                            margin: "10px 0 20px 0",
                            color: colors.grey[100],
                        }}
                    >
                        {!collapsed && (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                ml="15px"
                            >
                                <Typography variant="h3" color={colors.grey[100]}>
                                    {userData?.user_role}
                                </Typography>
                                <IconButton
                                    onClick={
                                        broken ? () => toggleSidebar() : () => collapseSidebar()
                                    }
                                >
                                    <CloseOutlinedIcon />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>
 
                    {!collapsed && (
                        <Box mb="25px">
                           <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                sx={{
                                    "& .avater-image": {
                                        backgroundColor: colors.primary[500],
                                    },
                                }}
                            >
                                <img
                                    className="avater-image"
                                    alt="profile user"
                                    width="100px"
                                    height="100px"
                                    src={userData?.profile_pic ? `data:image/jpeg;base64,${userData?.profile_pic}` : "/assets/vms-user-logo.svg"}
                                    style={{ cursor: "pointer", borderRadius: "50%", objectFit: "cover" }}
                                />
                            </Box>
                            <Box textAlign="center">
                                <Typography
                                    variant="h3"
                                    color={colors.grey[100]}
                                    fontWeight="bold"
                                    sx={{ m: "10px 0 0 0" }}
                                >
                                    {userData?.f_name+" "+userData?.l_name}
                                </Typography>
                            </Box>
                        </Box>
                    )}
 
                    <Box paddingLeft={collapsed ? undefined : "10%"}>
                


<Item
    title="Admin Dashboard"
    to="/"
    icon={<HomeOutlinedIcon />}
    selected={selected}
    setSelected={setSelected}
/>



<SubMenu
    label="Leave Management"
    icon={<EventNoteOutlinedIcon />}
>
    <Item
        title="Leave Calendar"
        to="/leave-calendar"
        icon={<CalendarMonthOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
    />

    <Item
        title="Employee Leaves"
        to="/employee-leaves"
        icon={<EventAvailableOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
    />

    <Item
        title="Leave Definition"
        to="/leave-definition"
        icon={<AssignmentOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
    />

    <Item
        title="Attendance"
        to="/attendance"
        icon={<AccessTimeOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
    />
</SubMenu>


<SubMenu
    label="HR Admin"
    icon={<ManageAccountsOutlinedIcon />}
>
  <Item
    title="Employee"
    to="/employee"
    icon={<PersonOutlineOutlinedIcon />}
    selected={selected}
    setSelected={setSelected}
/>

    <Item
        title="Financial Definition"
        to="/financial-definition"
        icon={<AccountBalanceWalletOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
    />

    <Item
        title="Payroll"
        to="/payroll"
        icon={<PaymentsOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
    />
</SubMenu>

{/* Master Data */}
<SubMenu
    label="Master Data"
    icon={<MapIcon />}
>
    <Item
        title="City"
        to="/city"
        icon={<LocationCityIcon />}
        selected={selected}
        setSelected={setSelected}
    />

    <Item
        title="State"
        to="/state"
        icon={<MapIcon />}
        selected={selected}
        setSelected={setSelected}
    />

    <Item
        title="Country"
        to="/country"
        icon={<PublicIcon />}
        selected={selected}
        setSelected={setSelected}
    />

    <Item
        title="Department"
        to="/department"
        icon={<BusinessIcon />}
        selected={selected}
        setSelected={setSelected}
    />

    <Item
        title="Designation"
        to="/designation"
        icon={<WorkOutlineIcon />}
        selected={selected}
        setSelected={setSelected}
    />
</SubMenu>

{/* Entity Management */}
<SubMenu
    label="Entity Management"
    icon={<BusinessIcon />}
>
    <Item
        title="Entity"
        to="/entity"
        icon={<BarChartOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
    />

    <Item
        title="Cost Center"
        to="/costcenter"
        icon={<BarChartOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
    />
</SubMenu>

{/* System Config */}
<SubMenu
    label="System Config"
    icon={<RequestQuoteOutlinedIcon />}
>
    <Item
        title="Cost Center Type"
        to="/costcentertype"
        icon={<RequestQuoteOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
    />

    <Item
        title="Contact Type"
        to="/contacttype"
        icon={<ContactPhoneOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
    />

    <Item
        title="Status"
        to="/status"
        icon={<InfoOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
    />
</SubMenu>



<SubMenu
    label="User Management"
    icon={<GroupOutlinedIcon />}
>
    <Item
        title="Manage User"
        to="/user"
        icon={<GroupOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
    />

    <Item
        title="Manage Contact"
        to="/contact"
        icon={<ContactPhoneOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
    />

    <Item
        title="Access Request"
        to="/access-requests"
        icon={<VpnKeyOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
    />

    <Item
        title="Users List"
        to="/users-list"
        icon={<PeopleOutlinedIcon />}
        selected={selected}
        setSelected={setSelected}
    />
</SubMenu>


                    </Box>
                </Menu>
            </Sidebar>
        </Box>
    );
};
 
export default MyProSidebar;