<script lang="ts">
  import Versions from './components/Versions.svelte'
  import CustomTitlebar from './components/CustomTitlebar.svelte'
  import { electron, api, debugLog } from '../utils/electronUtils'
  import electronLogo from './assets/electron.svg'

  // IPC 테스트 함수
  const ipcHandle = (): void => {
    electron.ipcRenderer.send('ping')
    debugLog('ping 메시지 전송됨')
  }

  // 새 창 생성 함수
  const createNewWindow = (): void => {
    api.createNewWindow()
    debugLog('새 창 생성 요청됨')
  }
</script>

<div class="app">
  <CustomTitlebar />
  <div class="content">
    <img alt="logo" class="logo" src={electronLogo} />
    <div class="creator">Powered by electron-vite</div>
    <div class="text">
      Build an Electron app with
      <span class="svelte">Svelte</span>
      and
      <span class="ts">TypeScript</span>
    </div>
    <p class="tip">Please try pressing <code>F12</code> to open the devTool</p>
    <div class="actions">
      <div class="action">
        <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">Documentation</a>
      </div>
      <div class="action">
        <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions a11y-missing-attribute-->
        <a target="_blank" rel="noreferrer" on:click={ipcHandle}>Send IPC</a>
      </div>
      <div class="action">
        <button on:click={createNewWindow}>새 창 열기</button>
      </div>
    </div>
    <Versions />
  </div>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
</style>
