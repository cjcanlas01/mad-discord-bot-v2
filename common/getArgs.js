/**
 * Returns arguments when commands are used
 * 
 * @param {name} name of command
 * @param {args} arguments of command
 */
module.exports = getArgs = (name, args) => {
    let arguments = args.replace(name, "").trim().split(" ");
    return arguments;
};