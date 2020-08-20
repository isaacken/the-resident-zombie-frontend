export default function (location: string) {
  return location.substr(location.lastIndexOf('/') + 1);
}