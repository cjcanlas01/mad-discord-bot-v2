let getArgs = (name, args) => {
    let arguments = args.replace(name, "").trim().split(" ");
    return arguments;
}

module.exports = getArgs;