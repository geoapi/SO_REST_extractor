export default function (babel) {

  const { types: t } = babel;

  

  return {

    name: "ast-transform", // not required

    visitor: {

      Identifier(path) {

        const p = path.find(parent => parent.isCallExpression);

        console.log(p.node.name);

        }

     

    }

  };

}


