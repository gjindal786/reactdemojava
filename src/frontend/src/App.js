import './App.css';

import {deleteStudent, getAllStudents} from "./client";
//useState Manage state for application so we run api call only once
import {useState, useEffect} from "react";

import {
    Layout,
    Menu,
    Breadcrumb,
    Table,
    Spin,
    Empty,
    Button,
    Tag,
    Badge,
    Avatar,
    Radio,
    Popconfirm,
    Image,
    Divider
} from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    LoadingOutlined, PlusOutlined
} from '@ant-design/icons';

import './App.css';
import StudentDrawerForm from "./StudentDrawerForm";
import {errorNotification, successNotification} from "./Notification";
const {
    Header,
    Content,
    Footer,
    Sider
} = Layout;
const { SubMenu } = Menu;

const TheAvatar = ({name}) => {
    let trim = name.trim();
    if (trim.length === 0) {
        return <Avatar icon={<UserOutlined/>}/>
    }
    let split = trim.split(" ");
    if(split.length === 1) {
        return <Avatar>{name.charAt(0)}</Avatar>
    }
    return <Avatar>{`${name.charAt(0)}${name.charAt(name.length - 1)}`}</Avatar>

}


function removeStudent(student, callback,setFetching) {
    setFetching(true);
    return deleteStudent(student.id).then(() => {
        console.log("student deleted");
        callback();
        successNotification("Student deleted successfully",`${student.name} was deleted from system`, 2)
    }).catch(err => {
        console.log(err.response);
        err.response.json().then(res => {
            console.log(res);
            errorNotification(res.error, `${res.message} [status code: ${res.status}]`, 2);
        });
    }).finally(() => setFetching(false));
}

const columns = (fetchStudentsObject,setFetchingObject) => [
    {
        title: '',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (text,student) => <TheAvatar name={student.name}/>
    },
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: 'Actions',
        key: 'gender',
        render: (text, student) =>
            <Radio.Group>
                <Popconfirm
                    placement="topRight"
                    title={`Are you sure to delete ${student.name}`}
                    onConfirm={() => removeStudent(student, fetchStudentsObject,setFetchingObject)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Radio.Button value="small">Delete</Radio.Button>
                </Popconfirm>
                <Radio.Button value="small">Edit</Radio.Button>
            </Radio.Group>
    }
];
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function App() {
      //Create object that manage userState
      const [students, setStudents] = useState([]);
      const [collapsed, setCollapsed] = useState(false);
      const [fetching, setFetching] = useState(true);
      const [showDrawer, setShowDrawer] = useState(false);
    const fetchStudents = () =>
          getAllStudents()
              .then(res => res.json())
              .then(data => {
                      setStudents(data);
                  }
              ).catch(err => {
                  console.log(err.response);
                  err.response.json().then(res => {
                      console.log(res);
                      errorNotification(res.error, `${res.message} [status code: ${res.status}]`, 2);
                  });
          }).finally(() => setFetching(false));

    const renderStudents = () => {
          if(fetching) {
              return <Spin indicator={antIcon}></Spin>
          }
          if(students.length <= 0) {
              return <>
                  <Button
                      onClick={() => setShowDrawer(!showDrawer)}
                      type="primary" shape="round" icon={<PlusOutlined/>} size="middle">
                      Add New Student
                  </Button>
                  <StudentDrawerForm
                      showDrawer={showDrawer}
                      setShowDrawer={setShowDrawer}
                      fetchStudents={fetchStudents}
                  />
                  <Empty/>
              </>
          }

          return <>
        <StudentDrawerForm
            showDrawer={showDrawer}
            setShowDrawer={setShowDrawer}
             fetchStudents={fetchStudents}
        />
        <Table
              dataSource={students} columns={columns(fetchStudents,setFetching)}
              bordered
              title={() =>
                  <>

                      <Tag style={{marginLeft:"0px"}}>Number of students</Tag>
                  <Badge count={students.length} className="site-badge-count-4"/>
                      <br/><br/>
                      <Button
                          onClick={() => setShowDrawer(!showDrawer)}
                          type="primary" shape="round" icon={<PlusOutlined />} size="middle">
                          Add New Student
                      </Button>
                  </>
              }
              // footer={() => 'Footer'}
              pagination={{ pageSize: 20 }} scroll={{ y: 400 }}
              rowKey={(student) => student.id}
          /></>;
    }
    //Runs when all deps -> dependencies has met here we have none.
      useEffect(() => {
        //return () => {
            console.log("component is mounted");
            fetchStudents();
        //};
      },[]);


    // if(students.length <= 0) {
    //     return "no data";
    // }
    /*return students.map((student, index) => {
        return <p key={index}>{student.id} {student.name}</p>
    })*/
    return <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed}
               onCollapse={setCollapsed}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<PieChartOutlined />}>
                    Option 1
                </Menu.Item>
                <Menu.Item key="2" icon={<DesktopOutlined />}>
                    Option 2
                </Menu.Item>
                <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                    <Menu.Item key="3">Tom</Menu.Item>
                    <Menu.Item key="4">Bill</Menu.Item>
                    <Menu.Item key="5">Alex</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                    <Menu.Item key="6">Team 1</Menu.Item>
                    <Menu.Item key="8">Team 2</Menu.Item>
                </SubMenu>
                <Menu.Item key="9" icon={<FileOutlined />}>
                    Files
                </Menu.Item>
            </Menu>
        </Sider>
        <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }} />
            <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                    {renderStudents()}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                <Image
                    width={75}
                    src="https://user-images.githubusercontent.com/24814824/210049149-4a20207b-7e65-4c56-9732-eb42c1f9a11e.png"
                />
                <Divider>
                    <a rel="noopener noreferrer" target="_blank" href="http://reactdemojava-env.eba-a5npcncn.eu-west-1.elasticbeanstalk.com" >Click here to access live url</a>
                </Divider>
            </Footer>
        </Layout>
    </Layout>
}

export default App;
