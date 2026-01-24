import {
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getCitiesCount,
  getCountriesCount,
  getStatesCount,
  getDepartmentsCount,
  getDesignationsCount,
  getEntitiesCount,
  getCostCentersCount,
  getAllAccessRequests,
  getPendingAccessRequestsCount,
} from "../../services/admin/dashboardCount";

// Icons
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PublicIcon from "@mui/icons-material/Public";
import MapIcon from "@mui/icons-material/Map";
import TrafficIcon from "@mui/icons-material/Traffic";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const theme = useTheme();
  const smScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [cityCount, setCityCount] = useState(0);
  const [countryCount, setCountryCount] = useState(0);
  const [stateCount, setStateCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [designationCount, setDesignationCount] = useState(0);
  const [costCenterCount, setCostCenterCount] = useState(0);
  const [entityCount, setEntityCount] = useState(0);
  const [pendingAccessCount, setPendingAccessCount] = useState(0);
  const [AccessCount, SetAccessCount] = useState(0);

  useEffect(() => {
    getCitiesCount()
      .then((res) => setCityCount(res.data.total))
      .catch((err) => console.error("Error fetching city count:", err));

    getCountriesCount()
      .then((res) => setCountryCount(res.data.total))
      .catch((err) => console.error("Error fetching country count:", err));

    getStatesCount()
      .then((res) => setStateCount(res.data.total))
      .catch((err) => console.error("Error fetching state count:", err));

    getDepartmentsCount()
      .then((res) => setDepartmentCount(res.data.total))
      .catch((err) => console.error("Error fetching department count:", err));

    getDesignationsCount()
      .then((res) => setDesignationCount(res.data.total))
      .catch((err) => console.error("Error fetching designation count:", err));

    getEntitiesCount()
      .then((res) => setEntityCount(res.data.total))
      .catch((err) => console.error("Error fetching entity count:", err));

    getCostCentersCount()
      .then((res) => setCostCenterCount(res.data.total))
      .catch((err) => console.error("Error fetching costcenter count:", err));
   

    getPendingAccessRequestsCount()
      .then((res) => setPendingAccessCount(res.data.pending_count))
      .catch((err) =>
        console.error("Error fetching pending access requests count:", err)
      );

       getAllAccessRequests()
      .then((res) => SetAccessCount(res.data.req_count))
      .catch((err) =>
        console.error("Error fetching users count:", err)
      );
  }, []);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box
        display={smScreen ? "flex" : "block"}
        flexDirection={smScreen ? "row" : "column"}
        justifyContent={smScreen ? "space-between" : "start"}
        alignItems={smScreen ? "center" : "start"}
        m="10px 0"
      >
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      {/* GRID & STATBOXES */}
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {/* Pending Access Requests */}
        <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
          
          <Box
            onClick={() => navigate("/access-requests")}
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={String(pendingAccessCount ?? 0)}
              subtitle="Pending Access Requests"
              
              
              icon={
                <VpnKeyOutlinedIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
        </Grid>

        <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
          <Box
            onClick={() => navigate("/users-list")}
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
          <StatBox
              title={String(AccessCount ?? 0)}
              subtitle="Users List"
            
              icon={
                <GroupOutlinedIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
        </Grid>

         {/* Entities */}
        <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
          <Box
            onClick={() => navigate("/Entity")}
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={String(entityCount ?? 0)}
              subtitle="Total Entities"
              icon={
                <TrafficIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
        </Grid>

          {/* Entities */}
        <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
          <Box
            onClick={() => navigate("/costcenter")}
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={String(costCenterCount ?? 0)}
              subtitle="Total Costcenters"
            
              icon={
                <BarChartOutlinedIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
        </Grid>

        {/* Cities */}
        <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
          <Box
            onClick={() => navigate("/city")}
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={String(cityCount ?? 0)}
              subtitle="Total Cities"
             
              icon={
                <LocationCityIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
        </Grid>

        {/* Countries */}
        <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
          <Box
           onClick={() => navigate("/country")}
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={String(countryCount ?? 0)}
              subtitle="Total Countries"
             
              icon={
                <PublicIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
        </Grid>

        {/* States */}
        <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
          <Box
            onClick={() => navigate("/state")}
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={String(stateCount ?? 0)}
              subtitle="Total States"
           
              icon={
                <MapIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
        </Grid>

        {/* Departments */}
        <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
          <Box
            onClick={() => navigate("/department")}
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={String(departmentCount ?? 0)}
              subtitle="Total Departments"
             
              icon={
                <TrafficIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
        </Grid>

        {/* Designations */}
        <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
          <Box
            onClick={() => navigate("/designation")}
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={String(designationCount ?? 0)}
              subtitle="Total Designations"
             
              icon={
                <TrafficIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
        </Grid>

       
      </Grid>
    </Box>
  );
};

export default Dashboard;
