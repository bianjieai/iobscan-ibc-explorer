'use strict';

module.exports = {
    types: [
        { value: 'feature', name: 'feature:  增加新功能' },
        { value: 'ui', name: 'ui:       更新UI' },
        { value: 'fix', name: 'fix:      修复bug' },
        { value: 'bug', name: 'bug:      测试反馈bug列表中的bug号' },
        { value: 'style', name: 'style:    代码格式(不影响代码运行的变动)' },
        { value: 'merge', name: 'merge:    合并分支' },
        { value: 'perf', name: 'perf:     性能优化' },
        { value: 'refactor', name: 'refactor: 重构(既不是增加feature，也不是修复bug)' },
        { value: 'chore', name: 'chore:    构建过程或辅助工具的变动(更改配置文件)' },
        { value: 'docs', name: 'docs:     文档变更' }
    ],
    // override the messages, defaults are as follows
    messages: {
        type: '请选择提交类型:',
        customScope: '请输入您修改的范围(可选):',
        subject: '请简要描述提交 message (可选):',
        body: '请输入详细描述(可选):',
        footer: '请输入要关闭的issue(可选):',
        confirmCommit: '确认使用以上信息提交？(y/n/e/h)'
    },
    allowCustomScopes: false,
    skipQuestions: ['footer'],
    subjectLimit: 72
};
