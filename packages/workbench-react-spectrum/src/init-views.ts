import {
  AccordionView,
  ActionBarView,
  ActionButtonView,
  ActionGroupView,
  ActionMenuView,
  AlertDialogView,
  AvatarView,
  BadgeView,
  BreadcrumbView,
  ButtonView,
  CalendarView,
  CardView,
  CheckboxGroupView,
  CheckboxView,
  CollapsibleView,
  ColorAreaView,
  ColorFieldView,
  ColorPickerView,
  ColorSliderView,
  ColorSwatchPickerView,
  ColorSwatchView,
  ColorWheelView,
  ComboBoxView,
  ContentPanelView,
  ContextualHelpView,
  DateFieldView,
  DatePickerView,
  DateRangePickerView,
  DialogView,
  DividerView,
  EmptyView,
  FileTriggerView,
  FlexView,
  FormView,
  GridView,
  HeadingView,
  ImageView,
  InlineAlertView,
  JsonView,
  KbdView,
  LabeledValueView,
  LinkView,
  ListBoxView,
  ListView,
  LogicButtonView,
  MenuBarView,
  MenuTriggerView,
  MenuView,
  MeterView,
  NumberFieldView,
  PaginationView,
  PickerView,
  PopoverView,
  ProgressBarView,
  ProgressCircleView,
  RadioGroupView,
  RangeCalendarView,
  RangeSliderView,
  ScrollAreaView,
  SearchFieldView,
  SheetView,
  SidebarView,
  SkeletonView,
  SliderView,
  SpinnerView,
  StatusLightView,
  SwitchView,
  TableView,
  TabsView,
  TagGroupView,
  TextAreaView,
  TextFieldView,
  TextView,
  TimeFieldView,
  ToastView,
  ToggleButtonView,
  TooltipView,
  TreeView,
  WellView,
} from "@statewalker/workbench-views";
import { getComponentRegistry } from "./layouts/app-shell.js";

import { ActionButtonRenderer } from "./renderers/actions/action-button.renderer.js";
import { ActionGroupRenderer } from "./renderers/actions/action-group.renderer.js";
import { ButtonRenderer } from "./renderers/actions/button.renderer.js";
import { FileTriggerRenderer } from "./renderers/actions/file-trigger.renderer.js";
import { LogicButtonRenderer } from "./renderers/actions/logic-button.renderer.js";
import { ToggleButtonRenderer } from "./renderers/actions/toggle-button.renderer.js";
import { ListBoxRenderer } from "./renderers/collections/list-box.renderer.js";
import { ListViewRenderer } from "./renderers/collections/list-view.renderer.js";
import { TableRenderer } from "./renderers/collections/table.renderer.js";
import { TagGroupRenderer } from "./renderers/collections/tag-group.renderer.js";
import { TreeRenderer } from "./renderers/collections/tree.renderer.js";
import { ColorAreaRenderer } from "./renderers/color/color-area.renderer.js";
import { ColorFieldRenderer } from "./renderers/color/color-field.renderer.js";
import { ColorPickerRenderer } from "./renderers/color/color-picker.renderer.js";
import { ColorSliderRenderer } from "./renderers/color/color-slider.renderer.js";
import { ColorSwatchRenderer } from "./renderers/color/color-swatch.renderer.js";
import { ColorSwatchPickerRenderer } from "./renderers/color/color-swatch-picker.renderer.js";
import { ColorWheelRenderer } from "./renderers/color/color-wheel.renderer.js";
import { AvatarRenderer } from "./renderers/content/avatar.renderer.js";
import { HeadingRenderer } from "./renderers/content/heading.renderer.js";
import { ImageRenderer } from "./renderers/content/image.renderer.js";
import { KeyboardRenderer } from "./renderers/content/keyboard.renderer.js";
import { LabeledValueRenderer } from "./renderers/content/labeled-value.renderer.js";
import { TextRenderer } from "./renderers/content/text.renderer.js";
import { WellRenderer } from "./renderers/content/well.renderer.js";
import { JsonRenderer } from "./renderers/data/json.renderer.js";
import { CalendarRenderer } from "./renderers/date-time/calendar.renderer.js";
import { DateFieldRenderer } from "./renderers/date-time/date-field.renderer.js";
import { DatePickerRenderer } from "./renderers/date-time/date-picker.renderer.js";
import { DateRangePickerRenderer } from "./renderers/date-time/date-range-picker.renderer.js";
import { RangeCalendarRenderer } from "./renderers/date-time/range-calendar.renderer.js";
import { TimeFieldRenderer } from "./renderers/date-time/time-field.renderer.js";
import { BadgeRenderer } from "./renderers/feedback/badge.renderer.js";
import { EmptyRenderer } from "./renderers/feedback/empty.renderer.js";
import { InlineAlertRenderer } from "./renderers/feedback/inline-alert.renderer.js";
import { MeterRenderer } from "./renderers/feedback/meter.renderer.js";
import { ProgressBarRenderer } from "./renderers/feedback/progress-bar.renderer.js";
import { ProgressCircleRenderer } from "./renderers/feedback/progress-circle.renderer.js";
import { SkeletonRenderer } from "./renderers/feedback/skeleton.renderer.js";
import { SpinnerRenderer } from "./renderers/feedback/spinner.renderer.js";
import { StatusLightRenderer } from "./renderers/feedback/status-light.renderer.js";
import { ToastRenderer } from "./renderers/feedback/toast.renderer.js";
import { CheckboxRenderer } from "./renderers/forms/checkbox.renderer.js";
import { CheckboxGroupRenderer } from "./renderers/forms/checkbox-group.renderer.js";
import { ComboBoxRenderer } from "./renderers/forms/combo-box.renderer.js";
import { FormRenderer } from "./renderers/forms/form.renderer.js";
import { NumberFieldRenderer } from "./renderers/forms/number-field.renderer.js";
import { PickerRenderer } from "./renderers/forms/picker.renderer.js";
import { RadioGroupRenderer } from "./renderers/forms/radio-group.renderer.js";
import { RangeSliderRenderer } from "./renderers/forms/range-slider.renderer.js";
import { SearchFieldRenderer } from "./renderers/forms/search-field.renderer.js";
import { SliderRenderer } from "./renderers/forms/slider.renderer.js";
import { SwitchRenderer } from "./renderers/forms/switch.renderer.js";
import { TextAreaRenderer } from "./renderers/forms/text-area.renderer.js";
import { TextFieldRenderer } from "./renderers/forms/text-field.renderer.js";
import { CardRenderer } from "./renderers/layout/card.renderer.js";
import { CollapsibleRenderer } from "./renderers/layout/collapsible.renderer.js";
import { ContentPanelRenderer } from "./renderers/layout/content-panel.renderer.js";
import { DividerRenderer } from "./renderers/layout/divider.renderer.js";
import { FlexRenderer } from "./renderers/layout/flex.renderer.js";
import { GridRenderer } from "./renderers/layout/grid.renderer.js";
import { ScrollAreaRenderer } from "./renderers/layout/scroll-area.renderer.js";
import { SidebarRenderer } from "./renderers/layout/sidebar.renderer.js";
import { ActionBarRenderer } from "./renderers/menus/action-bar.renderer.js";
import { ActionMenuRenderer } from "./renderers/menus/action-menu.renderer.js";
import { MenuRenderer } from "./renderers/menus/menu.renderer.js";
import { MenuBarRenderer } from "./renderers/menus/menu-bar.renderer.js";
import { MenuTriggerRenderer } from "./renderers/menus/menu-trigger.renderer.js";
import { AccordionRenderer } from "./renderers/navigation/accordion.renderer.js";
import { BreadcrumbRenderer } from "./renderers/navigation/breadcrumb.renderer.js";
import { LinkRenderer } from "./renderers/navigation/link.renderer.js";
import { PaginationRenderer } from "./renderers/navigation/pagination.renderer.js";
import { TabsRenderer } from "./renderers/navigation/tabs.renderer.js";
import { AlertDialogRenderer } from "./renderers/overlays/alert-dialog.renderer.js";
import { ContextualHelpRenderer } from "./renderers/overlays/contextual-help.renderer.js";
import { DialogRenderer } from "./renderers/overlays/dialog.renderer.js";
import { PopoverRenderer } from "./renderers/overlays/popover.renderer.js";
import { SheetRenderer } from "./renderers/overlays/sheet.renderer.js";
import { TooltipRenderer } from "./renderers/overlays/tooltip.renderer.js";

export function initSpectrumViews(ctx: Record<string, unknown>): () => void {
  const registry = getComponentRegistry(ctx);
  const cleanups = [
    registry.register(ActionButtonView, ActionButtonRenderer),
    registry.register(ActionGroupView, ActionGroupRenderer),
    registry.register(ButtonView, ButtonRenderer),
    registry.register(FileTriggerView, FileTriggerRenderer),
    registry.register(LogicButtonView, LogicButtonRenderer),
    registry.register(ToggleButtonView, ToggleButtonRenderer),
    registry.register(ListBoxView, ListBoxRenderer),
    registry.register(ListView, ListViewRenderer),
    registry.register(TableView, TableRenderer),
    registry.register(TagGroupView, TagGroupRenderer),
    registry.register(TreeView, TreeRenderer),
    registry.register(ColorAreaView, ColorAreaRenderer),
    registry.register(ColorFieldView, ColorFieldRenderer),
    registry.register(ColorPickerView, ColorPickerRenderer),
    registry.register(ColorSliderView, ColorSliderRenderer),
    registry.register(ColorSwatchPickerView, ColorSwatchPickerRenderer),
    registry.register(ColorSwatchView, ColorSwatchRenderer),
    registry.register(ColorWheelView, ColorWheelRenderer),
    registry.register(AvatarView, AvatarRenderer),
    registry.register(HeadingView, HeadingRenderer),
    registry.register(ImageView, ImageRenderer),
    registry.register(KbdView, KeyboardRenderer),
    registry.register(LabeledValueView, LabeledValueRenderer),
    registry.register(TextView, TextRenderer),
    registry.register(WellView, WellRenderer),
    registry.register(JsonView, JsonRenderer),
    registry.register(CalendarView, CalendarRenderer),
    registry.register(DateFieldView, DateFieldRenderer),
    registry.register(DatePickerView, DatePickerRenderer),
    registry.register(DateRangePickerView, DateRangePickerRenderer),
    registry.register(RangeCalendarView, RangeCalendarRenderer),
    registry.register(TimeFieldView, TimeFieldRenderer),
    registry.register(BadgeView, BadgeRenderer),
    registry.register(EmptyView, EmptyRenderer),
    registry.register(InlineAlertView, InlineAlertRenderer),
    registry.register(MeterView, MeterRenderer),
    registry.register(ProgressBarView, ProgressBarRenderer),
    registry.register(ProgressCircleView, ProgressCircleRenderer),
    registry.register(SkeletonView, SkeletonRenderer),
    registry.register(SpinnerView, SpinnerRenderer),
    registry.register(StatusLightView, StatusLightRenderer),
    registry.register(ToastView, ToastRenderer),
    registry.register(CheckboxGroupView, CheckboxGroupRenderer),
    registry.register(CheckboxView, CheckboxRenderer),
    registry.register(ComboBoxView, ComboBoxRenderer),
    registry.register(FormView, FormRenderer),
    registry.register(NumberFieldView, NumberFieldRenderer),
    registry.register(PickerView, PickerRenderer),
    registry.register(RadioGroupView, RadioGroupRenderer),
    registry.register(RangeSliderView, RangeSliderRenderer),
    registry.register(SearchFieldView, SearchFieldRenderer),
    registry.register(SliderView, SliderRenderer),
    registry.register(SwitchView, SwitchRenderer),
    registry.register(TextAreaView, TextAreaRenderer),
    registry.register(TextFieldView, TextFieldRenderer),
    registry.register(CardView, CardRenderer),
    registry.register(CollapsibleView, CollapsibleRenderer),
    registry.register(ContentPanelView, ContentPanelRenderer),
    registry.register(DividerView, DividerRenderer),
    registry.register(FlexView, FlexRenderer),
    registry.register(GridView, GridRenderer),
    registry.register(ScrollAreaView, ScrollAreaRenderer),
    registry.register(SidebarView, SidebarRenderer),
    registry.register(ActionBarView, ActionBarRenderer),
    registry.register(ActionMenuView, ActionMenuRenderer),
    registry.register(MenuBarView, MenuBarRenderer),
    registry.register(MenuView, MenuRenderer),
    registry.register(MenuTriggerView, MenuTriggerRenderer),
    registry.register(AccordionView, AccordionRenderer),
    registry.register(BreadcrumbView, BreadcrumbRenderer),
    registry.register(LinkView, LinkRenderer),
    registry.register(PaginationView, PaginationRenderer),
    registry.register(TabsView, TabsRenderer),
    registry.register(AlertDialogView, AlertDialogRenderer),
    registry.register(ContextualHelpView, ContextualHelpRenderer),
    registry.register(DialogView, DialogRenderer),
    registry.register(PopoverView, PopoverRenderer),
    registry.register(SheetView, SheetRenderer),
    registry.register(TooltipView, TooltipRenderer),
  ];
  return () => {
    for (const c of cleanups) c();
  };
}
