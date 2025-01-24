import SideNav from './SideNav';
import Content from '../Content';

export default function PageLayout() {
  return (
    <div className='h-[calc(100vh-58px)] w-full flex'>
      <SideNav />
      <Content />
    </div>
  );
}
