# Excore

A dependency injection framework for Express using [JService](https://github.com/rhaldkhein/jservice), which is Inspired by .Net Core.

JService is a DI container that provides dependency scoping, such as Singleton, Scoped and Transcient. That means you can have DI based application without bloating it with global or singleton services that stays forever. Scoped services are short-lived and will be cleared when the request is finished. Transient services will always create new instance everytime you need the service.

### Install

```sh
npm install excore
```

#### License
MIT