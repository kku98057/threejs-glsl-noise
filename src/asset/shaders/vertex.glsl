varying vec2 vUv;
varying vec3 vPosition;
varying vec2 vScreenSpace;
varying vec3 vNormal;
varying vec3 vViewDirection;

void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(mat3(modelMatrix)*normal);
    vec4 mvPosition = modelViewMatrix * vec4( position , 1.);


    vec3 worldPosition = (modelMatrix * vec4(position,1.)).xyz;
    vViewDirection = normalize(worldPosition - cameraPosition);

    gl_PointSize = 10. * (1. / - mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vScreenSpace = gl_Position.xy/gl_Position.w;
}