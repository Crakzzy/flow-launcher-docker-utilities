export interface DockerContainer {
    Command: string,
    CreatedAt: string,
    ID: string,
    Image: string,
    Labels: string,
    LocalVolumes: string,
    Mounts: string,
    Names: string,
    Networks: string,
    Ports: string,
    RunningFor: string,
    Size: string,
    State: string,
    Status: string,
}

interface State {
    Status: string;
    Running: boolean;
    Paused: boolean;
    Restarting: boolean;
    OOMKilled: boolean;
    Dead: boolean;
    Pid: number | null;
    ExitCode: number;
    Error: string;
    StartedAt: string;
    FinishedAt: string;
}

interface PortBinding {
    HostIp: string;
    HostPort: string;
}

interface LogConfig {
    Type: string;
    Config: Record<string, any>;
}

interface RestartPolicy {
    Name: string;
    MaximumRetryCount: number;
}

interface HostConfig {
    Binds: string[] | null;
    ContainerIDFile: string;
    LogConfig: LogConfig;
    NetworkMode: string;
    PortBindings: Record<string, PortBinding[]> | null;
    RestartPolicy: RestartPolicy;
    AutoRemove: boolean;
    VolumeDriver: string;
    VolumesFrom: string[] | null;
    ConsoleSize: [number, number];
    CapAdd: string[] | null;
    CapDrop: string[] | null;
    CgroupnsMode: string;
    Dns: string[];
    DnsOptions: string[];
    DnsSearch: string[];
    ExtraHosts: string[];
    GroupAdd: string[] | null;
    IpcMode: string;
    Cgroup: string;
    Links: string[] | null;
    OomScoreAdj: number;
    PidMode: string;
    Privileged: boolean;
    PublishAllPorts: boolean;
    ReadonlyRootfs: boolean;
    SecurityOpt: string[] | null;
    UTSMode: string;
    UsernsMode: string;
    ShmSize: number;
    Runtime: string;
    Isolation: string;
    CpuShares: number;
    Memory: number;
    NanoCpus: number;
    CgroupParent: string;
    BlkioWeight: number;
    BlkioWeightDevice: any | null;
    BlkioDeviceReadBps: any | null;
    BlkioDeviceWriteBps: any | null;
    BlkioDeviceReadIOps: any | null;
    BlkioDeviceWriteIOps: any | null;
    CpuPeriod: number;
    CpuQuota: number;
    CpuRealtimePeriod: number;
    CpuRealtimeRuntime: number;
    CpusetCpus: string;
    CpusetMems: string;
    Devices: any | null;
    DeviceCgroupRules: any | null;
    DeviceRequests: any | null;
    MemoryReservation: number;
    MemorySwap: number;
    MemorySwappiness: number | null;
    OomKillDisable: boolean;
    PidsLimit: number | null;
    Ulimits: any | null;
    CpuCount: number;
    CpuPercent: number;
    IOMaximumIOps: number;
    IOMaximumBandwidth: number;
    MaskedPaths: string[];
    ReadonlyPaths: string[];
}

interface GraphDriverData {
    ID: string;
    LowerDir: string;
    MergedDir: string;
    UpperDir: string;
    WorkDir: string;
}

interface GraphDriver {
    Data: GraphDriverData;
    Name: string;
}

interface Mount {
    Type: string;
    Source: string;
    Destination: string;
    Mode: string;
    RW: boolean;
    Propagation: string;
}

interface ExposedPorts {
    [key: string]: {};
}

interface Config {
    Hostname: string;
    Domainname: string;
    User: string;
    AttachStdin: boolean;
    AttachStdout: boolean;
    AttachStderr: boolean;
    ExposedPorts: ExposedPorts | null;
    Tty: boolean;
    OpenStdin: boolean;
    StdinOnce: boolean;
    Env: string[] | null;
    Cmd: string[] | null;
    Image: string;
    Volumes: Record<string, {}> | null;
    WorkingDir: string;
    Entrypoint: string[] | null;
    OnBuild: string[] | null;
    Labels: Record<string, string> | null;
    StopSignal: string;
}

interface NetworkSettingsNetwork {
    IPAMConfig: any | null;
    Links: any | null;
    Aliases: string[] | null;
    MacAddress: string;
    DriverOpts: any | null;
    GwPriority: number;
    NetworkID: string;
    EndpointID: string;
    Gateway: string;
    IPAddress: string;
    IPPrefixLen: number;
    IPv6Gateway: string;
    GlobalIPv6Address: string;
    GlobalIPv6PrefixLen: number;
    DNSNames: string[] | null;
}

interface Networks {
    [key: string]: NetworkSettingsNetwork;
}

interface NetworkSettings {
    Bridge: string;
    SandboxID: string;
    SandboxKey: string;
    Ports: Record<string, PortBinding[]> | null;
    HairpinMode: boolean;
    LinkLocalIPv6Address: string;
    LinkLocalIPv6PrefixLen: number;
    SecondaryIPAddresses: any | null;
    SecondaryIPv6Addresses: any | null;
    EndpointID: string;
    Gateway: string;
    GlobalIPv6Address: string;
    GlobalIPv6PrefixLen: number;
    IPAddress: string;
    IPPrefixLen: number;
    IPv6Gateway: string;
    MacAddress: string;
    Networks: Networks;
}

export interface DockerContainerInfo {
    Id: string;
    Created: string;
    Path: string;
    Args: string[];
    State: State;
    Image: string;
    ResolvConfPath: string;
    HostnamePath: string;
    HostsPath: string;
    LogPath: string;
    Name: string;
    RestartCount: number;
    Driver: string;
    Platform: string;
    MountLabel: string;
    ProcessLabel: string;
    AppArmorProfile: string;
    ExecIDs: string[] | null;
    HostConfig: HostConfig;
    GraphDriver: GraphDriver;
    Mounts: Mount[];
    Config: Config;
    NetworkSettings: NetworkSettings;
}