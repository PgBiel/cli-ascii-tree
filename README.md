# cli-ascii-tree
CLI interface for ascii-tree

## Install
`npm install cli-ascii-tree -g`

**Do not forget the `-g` option!**


## Usage
`ascii-tree`

Answer the questions!

## Example File

```
#/
##Users
###MyUser
####Files
###OtherUser
####Files2
##System
###info.txt
##Etc
###nothing.txt
```

Results in:

```
/
├─ Users
│  ├─ MyUser
│  │  └─ Files
│  └─ OtherUser
│     └─ Files2
├─ System
│  └─ info.txt
└─ Etc
   └─ nothing.txt
```