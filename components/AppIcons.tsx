import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  filled?: boolean;
}

const MaterialIcon = ({ name, className = "", size = 24, filled = false }: { name: string } & IconProps) => (
  <span 
    className={`material-symbols-rounded select-none ${filled ? 'icon-filled' : ''} ${className}`} 
    style={{ fontSize: size }}
  >
    {name}
  </span>
);

// Navigation
export const IconHome = (props: IconProps) => <MaterialIcon name="home" {...props} />;
export const IconBook = (props: IconProps) => <MaterialIcon name="calendar_month" {...props} />;
export const IconEvents = (props: IconProps) => <MaterialIcon name="trophy" {...props} />;
export const IconProfile = (props: IconProps) => <MaterialIcon name="account_circle" {...props} />;
export const IconDashboard = (props: IconProps) => <MaterialIcon name="dashboard" {...props} />;
export const IconRequests = (props: IconProps) => <MaterialIcon name="fact_check" {...props} />;

// Actions
export const IconPlus = (props: IconProps) => <MaterialIcon name="add" {...props} />;
export const IconPlusCircle = (props: IconProps) => <MaterialIcon name="add_circle" {...props} />;
export const IconSearch = (props: IconProps) => <MaterialIcon name="search" {...props} />;
export const IconFilter = (props: IconProps) => <MaterialIcon name="tune" {...props} />;
export const IconBell = (props: IconProps) => <MaterialIcon name="notifications" {...props} />;
export const IconSettings = (props: IconProps) => <MaterialIcon name="settings" {...props} />;
export const IconLogOut = (props: IconProps) => <MaterialIcon name="logout" {...props} />;
export const IconEdit = (props: IconProps) => <MaterialIcon name="edit" {...props} />;
export const IconSend = (props: IconProps) => <MaterialIcon name="send" {...props} />;
export const IconMore = (props: IconProps) => <MaterialIcon name="more_vert" {...props} />;
export const IconClose = (props: IconProps) => <MaterialIcon name="close" {...props} />;
export const IconCheck = (props: IconProps) => <MaterialIcon name="check" {...props} />;
export const IconChevronLeft = (props: IconProps) => <MaterialIcon name="arrow_back" {...props} />;
export const IconArrowRight = (props: IconProps) => <MaterialIcon name="arrow_forward" {...props} />;
export const IconTrash = (props: IconProps) => <MaterialIcon name="delete" {...props} />;
export const IconMinus = (props: IconProps) => <MaterialIcon name="remove" {...props} />;
export const IconShare = (props: IconProps) => <MaterialIcon name="share" {...props} />;

// Feedback / State
export const IconSuccess = (props: IconProps) => <MaterialIcon name="check_circle" {...props} />;
export const IconWarning = (props: IconProps) => <MaterialIcon name="error" {...props} />;
export const IconInfo = (props: IconProps) => <MaterialIcon name="info" {...props} />;
export const IconLock = (props: IconProps) => <MaterialIcon name="lock" {...props} />;
export const IconUnlock = (props: IconProps) => <MaterialIcon name="lock_open" {...props} />;
export const IconVisibility = (props: IconProps) => <MaterialIcon name="visibility" {...props} />;
export const IconVisibilityOff = (props: IconProps) => <MaterialIcon name="visibility_off" {...props} />;
export const IconLoader = (props: IconProps) => <MaterialIcon name="progress_activity" className={`animate-spin ${props.className || ''}`} {...props} />;

// Domain
export const IconMapPin = (props: IconProps) => <MaterialIcon name="location_on" {...props} />;
export const IconClock = (props: IconProps) => <MaterialIcon name="schedule" {...props} />;
export const IconCalendar = (props: IconProps) => <MaterialIcon name="calendar_today" {...props} />;
export const IconUsers = (props: IconProps) => <MaterialIcon name="group" {...props} />;
export const IconUser = (props: IconProps) => <MaterialIcon name="person" {...props} />;
export const IconBuilding = (props: IconProps) => <MaterialIcon name="domain" {...props} />; // or stadium
export const IconCourt = (props: IconProps) => <MaterialIcon name="grid_view" {...props} />;
export const IconMoney = (props: IconProps) => <MaterialIcon name="attach_money" {...props} />;
export const IconStar = (props: IconProps) => <MaterialIcon name="star" {...props} />;
export const IconPhone = (props: IconProps) => <MaterialIcon name="call" {...props} />;
export const IconMail = (props: IconProps) => <MaterialIcon name="mail" {...props} />;
export const IconGlobe = (props: IconProps) => <MaterialIcon name="language" {...props} />;
export const IconShield = (props: IconProps) => <MaterialIcon name="verified_user" {...props} />;
export const IconCreditCard = (props: IconProps) => <MaterialIcon name="credit_card" {...props} />;
export const IconQrCode = (props: IconProps) => <MaterialIcon name="qr_code" {...props} />;
export const IconStore = (props: IconProps) => <MaterialIcon name="storefront" {...props} />;

// Sports (Mapped)
export const IconFootball = (props: IconProps) => <MaterialIcon name="sports_soccer" {...props} />;
export const IconTennis = (props: IconProps) => <MaterialIcon name="sports_tennis" {...props} />;
export const IconBasketball = (props: IconProps) => <MaterialIcon name="sports_basketball" {...props} />;
export const IconVolleyball = (props: IconProps) => <MaterialIcon name="sports_volleyball" {...props} />;
// Using 'toys' (pinwheel) for Badminton as it resembles the feathers of a shuttlecock
export const IconBadminton = (props: IconProps) => <MaterialIcon name="toys" {...props} />; 
// Using 'sports_cricket' (flat bat) for Beach Tennis as it resembles the paddle better than a stringed racquet
export const IconBeachTennis = (props: IconProps) => <MaterialIcon name="sports_cricket" {...props} />; 
export const IconGenericSport = (props: IconProps) => <MaterialIcon name="sports" {...props} />;
