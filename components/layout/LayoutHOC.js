/* eslint-disable react/display-name */
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useState } from "react";

import {
  SmileOutlined,
  SettingOutlined,
  PlaySquareOutlined,
  UserOutlined,
  VideoCameraOutlined,
  DashboardOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isConsole,
  isMobile,
} from "react-device-detect";
import toast, { Toaster } from 'react-hot-toast';
import { Route, MenuDataItem } from "@ant-design/pro-layout/lib/typings";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { signOut } from "next-auth/react";
import { RiGroupLine } from "react-icons/ri";
import {
  AiFillRobot,
  AiOutlineDashboard,
  AiOutlineLogout,
  AiOutlineSetting,
} from "react-icons/ai";
import { BiHelpCircle } from "react-icons/bi";
import { HiUserGroup } from "react-icons/hi";
import { BsCalendarCheck } from "react-icons/bs";
import { MdOutlineAccountCircle } from "react-icons/md";
import Image from "next/image";
import Router from "next/router";
import { Layout, Menu, Dropdown, Button, Space } from "antd";


const ProLayout = dynamic(() => import("@ant-design/pro-layout"), {
  ssr: false,
});

const DefaultFooter = dynamic(() => import("@ant-design/pro-layout"), {
  ssr: false,
});

const menuItemRender = (options, element) => (
  <Link prefetch={true} href={`${options?.path}`}>
    <a>{element}</a>
  </Link>
);

const Main = (WrappedComponent, pagekey = 1, query = "_User", collapsedD= false) => {



  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        collapsed: collapsedD,
      };
    }

    ROUTES = {
      path: "/",
      routes: [
        {
          path: "/",

          name: "Dashboard",
          icon: (
            <span className="anticon">
              <AiOutlineDashboard size={20} />
            </span>
          ),
        },

        {
          path: "/staffs",
          name: "Staff List",
          icon: <HiUserGroup size={20} className="anticon" />,
        },
        {
          path: "/shiftroster",
          name: "Shift Roster",
          icon: <BsCalendarCheck size={20} className="anticon" />,
        },
        // {
        //   path: "/medical-shiftroster",
        //   name: "Leave Roster",
        //   icon: <BsCalendarCheck size={20} className="anticon" />,
        // },
        // {
        //   path: "/scheduler",
        //   name: "Work Excuse",
        //   icon: <AiFillRobot className="anticon" />,
        // },
        {
          path: "#",
          name: "Settings",
          icon: (
            <span className="anticon">
              <AiOutlineSetting size={20} />
            </span>
          ),
          routes: [
            {
              path: "/profile_settings",
              name: "My Profile",
              icon: <SettingOutlined />,
            },

            {
              path: "/settings",
              name: "System Settings",
              icon: <SettingOutlined />,
            },
          ],
        },
      ],
    };

    menu = (
      <Menu
        // defaultActiveFirst={false}

        items={[
          {
            onClick: () => {},
            label: "Help",
            key: "1",
            icon: <BiHelpCircle />,
          },
          {
            onClick: async () => {
              // signOut({redirect: false})
            },
            label: "Profile Settings",
            key: "2",
            icon: <UserOutlined />,
            onClick: () => {
              Router.push("/profile_settings");
            },
          },
          {
            onClick: async () => {
              // signOut({redirect: false})

              signOut({ redirect: true, callbackUrl: "/" });
            },
            label: "Log out",
            key: "3",
            icon: <AiOutlineLogout />,
          },
        ]}
      />
    );

    render() {
      const { collapsed } = this.state;
      const callDesktop = !isMobile
        ? { collapsed: collapsed, collapsedButtonRender: false }
        : null;

      return (
        <ProLayout
          title="BAS"
          logo="/logo.svg"
          headerHeight={60}
          headerContentRender={() => {
            if (isMobile) return;
            return (
              <div
                onClick={() =>
                  this.setState({ collapsed: !this.state.collapsed })
                }
                style={{
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </div>
            );
          }}
          rightContentRender={() => (
            <div className="avatar_drop py-4 h-full flex items-center">
              <Dropdown
                className="avatar_image"
                overlay={this.menu}
                placement="bottomRight"
                arrow
              >
                <Image
                  src="/svg/avatar-profile.svg"
                  alt="Picture of the author"
                  width={40}
                  height={40}
                />
              </Dropdown>
            </div>
          )}
          menuFooterRender={(props) => {
            return (
              <>

              </>
            );
          }}
          style={{ minHeight: "100vh", padding: 0, margin: 0 }}
          route={this.ROUTES}
          {...{
            fixSiderbar: true,
            ...callDesktop,
            navTheme: "dark",
            primaryColor: "#F5222D",
            layout: "sidemenu",
            siderWidth: 240,
            pwa: false,
          }}
          menuItemRender={menuItemRender}
        >
          <WrappedComponent {...this.props} />

          <footer style={{ minHeight: 20 }}></footer>
          <Toaster/>
        </ProLayout>
      );
    }
  };
}

export default Main