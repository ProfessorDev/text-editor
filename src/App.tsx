import { FormProvider, useForm } from "react-hook-form";
import { TextEditor } from "./components/TextEditor";
import { EditorForm } from "./types";

type ExtraProps = {
  x: string;
};

function App() {
  const methods = useForm<EditorForm & ExtraProps>({
    defaultValues: {
      text: "",
      selection: {
        start: 0,
        end: 0,
      },
      fileUpload: {
        needCount: 0,
        loading: false,
      },
      x: "",
    },
  });

  const { handleSubmit, register } = methods;

  const onSubmit = (data: EditorForm) => {
    console.log(data);
  };

  return (
    <div className="App">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextEditor
            onFileUpload={async (file) => {
              await new Promise((resolve) => {
                setTimeout(() => {
                  resolve(undefined);
                }, 3000);
              });
              return {
                file: file,
                type: "success",
                url: URL.createObjectURL(file),
              };
            }}
          />
          <input {...register("x")} />
          <button type="submit">Submit</button>
        </form>
      </FormProvider>
    </div>
  );
}

export default App;
