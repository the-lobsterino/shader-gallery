Status Name DisplayName
------ ---- -----------
Running AdobeActiveFile... Adobe Active File Monitor V4
Stopped Alerter Alerter
Running ALG Application Layer Gateway Service
Stopped AppMgmt Application Management
Running ASChannel Local Communication Channel
PS C:\> get-alias | convertto-html > aliases.htm
PS C:\> invoke-item aliases.htm
PS C:\> Checkpoint-Computer -Description "My 2nd checkpoint" -RestorePointType "Modify_Settings"
PS C:\> Get-ComputerRestorePoint | format-list
__GENUS : 2
__CLASS : SystemRestore
__SUPERCLASS :
__DYNASTY : SystemRestore
__RELPATH : SystemRestore.SequenceNumber=59
__PROPERTY_COUNT : 5
__DERIVATION : {}
__SERVER : CLIENT2
__NAMESPACE : root\default
__PATH : \\CLIENT2\root\default:SystemRestore.SequenceNumber=59
CreationTime : 20120202180537.316029-000
Description : My 2nd checkpoint
EventType : 100
RestorePointType : 12
SequenceNumber : 59
