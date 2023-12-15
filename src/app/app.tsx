import { GithubOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Col, ConfigProvider, Layout, Row, Switch, theme, notification } from 'antd';
import { FC, Fragment, useEffect, useMemo, useRef, useState, RefObject, useCallback } from 'react';
import QueueAnim from 'rc-queue-anim';
import Texty from 'rc-texty';
import { DirectionalLight, AmbientLight, Color, TrackballControls, Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, BoxBufferGeometry, Vector3 } from 'three';
import { SimpleGrid, Components, SimpleScene, SimpleRenderer, SimpleCamera, SimpleRaycaster } from 'openbim-components';
import { THEMES, useStore } from '../store';

const { Header, Footer } = Layout;

enum ORIENTATIONS {
  TOP = 'top',
  BOTTOM = 'bottom',
  FRONT = 'front',
  BACK = 'back',
  LEFT = 'left',
  RIGHT = 'right',
}

export const App: FC = () => {
  const store = useStore();
  const ref = useRef<HTMLDivElement>(null);
  const [api, context] = notification.useNotification();

  useEffect(() => {
    api.open({
      duration: 0,
      placement: 'bottomLeft',
      message: 'Find out how you can help.',
      description: (
        <Fragment>
          Simple IFC stands in solidarity with the Ukrainian people against the Russian invasion.
          <Button style={{ marginTop: '12px' }} type="default" shape="round" target="_blank" href="https://war.ukraine.ua/support-ukraine/">HELP UKRAINE</Button>
        </Fragment>
      )
    });
  }, [api]);

  const t = store.get('theme');
  useEffect(() => {
    if (!ref || !ref.current) {
      return;
    }
    let components: any;
    if (!components) {
      components = new Components();
      components.scene = new SimpleScene(components);
      components.renderer = new SimpleRenderer(components, ref.current);
      components.camera = new SimpleCamera(components);
      components.raycaster = new SimpleRaycaster(components);
  
      components.init();
  
      new SimpleGrid(components);
  
      const scene = components.scene.get();
      scene.background = new Color(t === THEMES.DARK ? '#000' : '#fff');
  
      const directionalLight = new DirectionalLight();
      directionalLight.position.set(5, 10, 3);
      directionalLight.intensity = 0.5;
      scene.add(directionalLight);
  
      const ambientLight = new AmbientLight();
      ambientLight.intensity = 0.5;
      scene.add(ambientLight);
  
      const boxMaterial = new MeshBasicMaterial({ color: '#6528D7' });
      const boxGeometry = new BoxGeometry(3, 3, 3);
      const cube = new Mesh(boxGeometry, boxMaterial);
      cube.position.set(0, 1.5, 0);
      scene.add(cube);
  
      (components.camera as SimpleCamera).controls.addEventListener('update', (ev: any) => {
        store.set('matrix', ev.target._camera.matrix.elements);
      });
    }


    return () => {
      if (components) {
        components.dispose();
      }
    }
  }, [ref, t]);

  const algorithm = t === THEMES.DARK ? theme.darkAlgorithm : theme.defaultAlgorithm;
  const matrix = store.get('matrix') || [];
  
  return (
    <div className="App" data-testid="app">
      <ConfigProvider theme={{ algorithm }}>
        <Layout className={t === THEMES.DARK ? 'dark' : ''}>
          <Header>
            <Row style={{
              margin: '0 auto',
              padding: '0 24px',
            }}>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="default" shape="round" target="_blank" href="https://github.com/dmytropaduchak/simple-ifc-example">Github</Button>
              </Col>
            </Row>
          </Header>
          <div style={{
            position: 'absolute',
            zIndex: 1,
            top: '28px',
            left: '28px',
            width: '510px',
          }}>
            <QueueAnim type="left" leaveReverse delay={100}>
              <div style={{
                fontSize: '74px',
                lineHeight: '0.8',
                textShadow: '1px 1px 6px white',
                textAlign: 'left',
              }}>
                <Texty type="alpha" mode="smooth" delay={100}>
                  Simple IFC
                </Texty>
              </div>
              <div style={{
                fontSize: '18px',
                lineHeight: '1.5',
                textShadow: '1px 1px 3px white',
                textAlign: 'left',
              }}>
                <Texty key="2" type="alpha" mode="smooth" delay={100}>
                  {"Utilizes the OpenBIM Components Library to effortlessly showcase IFC models in a browser environment. With intuitive features and powerful visualization tools, it provides a seamless and engaging experience for exploring intricate building information models."}
                </Texty>
              </div>
            </QueueAnim>
          </div>
        {/* <Upload accept=".ifc,.json" onChange={(ev) => {
          // setFile(ev.file);
          // const modelID = ifcAPI.OpenModel(data, { OPTIMIZE_PROFILES: true, COORDINATE_TO_ORIGIN: true, USE_FAST_BOOLS: true }); 
          // const time = ms() - start;
          // console.log(`Opening model took ${time} ms`);
          // ifcThree.LoadAllGeometry(scene, modelID);
        }}>
          <Button shape="circle"  icon={<FolderOpenOutlined />}/>
        </Upload> */}
          {/* <IFC dark menu grid axes url={''} /> */}
          {/* <IFCNavigation /> */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: 'calc(100vh - 32px)',
          }}>
            <div style={{
              top: 0,
              left: 0,
              right: 0,
              position: 'absolute',
              height: '100vh',
              width: '100%',
            }} ref={ref}></div>

            <div style={{
              width: 120,
              height: 120,
              position: 'absolute',
              right: 24,
              bottom: 0,
            }}>
              {matrix ? <div className="cube" style={{
                transform: `matrix3d(
                  ${matrix[0]},
                  ${matrix[1]},
                  ${matrix[2]},
                  0,
                  ${matrix[4]},
                  ${matrix[5]},
                  ${matrix[6]},
                  0,
                  ${matrix[8]},
                  ${matrix[9]},
                  ${matrix[10]},
                  0,
                  0,
                  0,
                  0,
                  1`
                }}>
                {Object.keys(ORIENTATIONS).map((orientation, key) => (
                    <div key={key} data-orientation={orientation.toLowerCase()} onClick={(ev) => {
                      console.log(ev)
                      // if (!vcControllerRef.current) {
                      //   return;
                      // }
                      // vcControllerRef.current.tweenCamera(
                      //   ViewCubeController.ORIENTATIONS[orientation]
                      // )
                    }}>
                      {orientation}
                    </div>
                  )
                )}
              </div> : null}

            </div>
          </div>
          <Footer>
            <Row style={{
              margin: '0 auto',
              padding: '0 24px',
            }}>
              <Col xs={24} md={12} style={{ textAlign: 'left' }}>
                <QueueAnim type="left" leaveReverse delay={100}>
                  <Button href="https://dmytropaduchak.github.io/simple-ifc-example/" type="link">{`Copyright © ${(new Date()).getFullYear()} Simple IFC Example`}</Button>
                  <Switch size="small" defaultChecked={store.get('theme') !== THEMES.DARK} style={{ marginLeft: 8 }} onChange={(checked) => {
                    store.set('theme', checked ? THEMES.LIGHT : THEMES.DARK);
                  }}/>
                </QueueAnim>
              </Col>
              <Col xs={24} md={12} style={{ textAlign: 'right' }}>
                <QueueAnim type="right" leaveReverse delay={100}>
                  <Button href="https://github.com/dmytropaduchak" type="link" target="_blank" icon={<GithubOutlined />}>Dmytro Paduchak</Button>
                </QueueAnim>
              </Col>
            </Row>
          </Footer>
        </Layout>
        {context}
      </ConfigProvider>
    </div>
  );
}
