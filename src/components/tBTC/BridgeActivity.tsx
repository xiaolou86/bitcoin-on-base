import { FC, createContext, useContext } from "react"
import {
  Badge,
  BodyMd,
  Image,
  List,
  useColorModeValue,
  Box,
  LinkBox,
  LinkOverlay,
  Stack,
  Skeleton,
  ListProps,
  HStack,
  StackProps,
  LabelSm,
} from "@threshold-network/components"
import {
  BridgeActivityStatus,
  BridgeActivity as BridgeActivityType,
} from "../../threshold-ts/tbtc"
import emptyHistoryImageSrcDark from "../../static/images/tBTC-bridge-no-history-dark.svg"
import emptyHistoryImageSrcLight from "../../static/images/tBTC-bridge-no-history-light.svg"
import { InlineTokenBalance } from "../TokenBalance"
import Link from "../Link"
import { OutlineListItem } from "../OutlineListItem"

const BridgeActivityContext = createContext<
  | {
      data: BridgeActivityType[]
      isBridgeHistoryEmpty: boolean
      isFetching: boolean
    }
  | undefined
>(undefined)

const useBridgeActivityContext = () => {
  const context = useContext(BridgeActivityContext)
  if (!context) {
    throw new Error(
      "BridgeActivityContext used outside of the BridgeActivity component."
    )
  }

  return context
}

export type BridgeActivityProps = {
  data: BridgeActivityType[]
  isFetching: boolean
}

export const BridgeActivity: FC<BridgeActivityProps> = ({
  data,
  isFetching,
  children,
}) => {
  const isBridgeHistoryEmpty = data.length === 0

  return (
    <BridgeActivityContext.Provider
      value={{
        data,
        isBridgeHistoryEmpty,
        isFetching,
      }}
    >
      {children}
    </BridgeActivityContext.Provider>
  )
}

export const BridgeAcivityHeader: FC<StackProps> = (props) => {
  return (
    <HStack justifyContent="space-between" mt="10" {...props}>
      <LabelSm color="gray.500">tBTC</LabelSm>
      <LabelSm color="gray.500">state</LabelSm>
    </HStack>
  )
}

export const BridgeActivityData: FC<ListProps> = (props) => {
  const { data, isBridgeHistoryEmpty, isFetching } = useBridgeActivityContext()

  return isFetching ? (
    <BridgeActivityLoadingState />
  ) : (
    <List spacing="1" mt="2" {...props}>
      {isBridgeHistoryEmpty ? <EmptyActivity /> : data.map(renderActivityItem)}
    </List>
  )
}

const ActivityItem: FC<BridgeActivityType> = ({
  amount,
  status,
  depositKey,
}) => {
  return (
    <ActivityItemWrapper>
      <LinkOverlay
        as={Link}
        textDecoration="none"
        _hover={{ textDecoration: "none" }}
        color="inherit"
        to={`/tBTC/mint/deposit/${depositKey}`}
      >
        <InlineTokenBalance tokenAmount={amount} />
      </LinkOverlay>
      <TBTCStatusBadge status={status} />
    </ActivityItemWrapper>
  )
}

const renderActivityItem = (item: BridgeActivityType) => (
  <ActivityItem key={item.depositKey} {...item} />
)

const bridgeActivityStatusToBadgeProps: Record<
  BridgeActivityStatus,
  { colorScheme: string }
> = {
  [BridgeActivityStatus.MINTED]: {
    colorScheme: "green",
  },
  [BridgeActivityStatus.PENDING]: {
    colorScheme: "yellow",
  },
  [BridgeActivityStatus.ERROR]: {
    colorScheme: "red",
  },
}

const TBTCStatusBadge: FC<{ status: BridgeActivityStatus }> = ({ status }) => {
  return (
    <Badge
      variant="subtle"
      {...bridgeActivityStatusToBadgeProps[status]}
      size="sm"
      display="flex"
      alignItems="center"
    >
      {status}
    </Badge>
  )
}

const ActivityItemWrapper: FC = ({ children }) => (
  <LinkBox as={OutlineListItem} pl="6" pr="3">
    {children}
  </LinkBox>
)

export const BridgeActivityEmptyHistoryImg: FC = () => {
  const { isBridgeHistoryEmpty, isFetching } = useBridgeActivityContext()
  const epmtyHistoryImg = useColorModeValue(
    emptyHistoryImageSrcLight,
    emptyHistoryImageSrcDark
  )

  return isBridgeHistoryEmpty && !isFetching ? (
    <>
      <Image alt="no-history" src={epmtyHistoryImg} mx="auto" mt={16} mb={4} />
      <BodyMd textAlign="center">You have no history yet.</BodyMd>
    </>
  ) : (
    <></>
  )
}

const EmptyActivity: FC = () => {
  return (
    <>
      <ActivityItemWrapper>
        <Box as="span">-.--</Box>
        <Box as="span">-.--</Box>
      </ActivityItemWrapper>
      <ActivityItemWrapper>
        <Box as="span">-.--</Box>
        <Box as="span">-.--</Box>
      </ActivityItemWrapper>
    </>
  )
}

const BridgeActivityLoadingState = () => {
  return (
    <Stack>
      <Skeleton height="20px" />
      <Skeleton height="20px" />
      <Skeleton height="20px" />
    </Stack>
  )
}
