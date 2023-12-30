import React, { useState, useRef } from 'react';
import { Form } from '@remix-run/react';

import HelpText from '~/components/shared/help-text';
import Button from '~/components/shared/button';

interface LinkItem {
    id: number;
    url: string;
  }
  
  interface FileItem {
    id: number;
    fileName: string;
  }
  
  interface QuestionItem {
    id: number;
    text: string;
  }
  
  type ActionData = {
    errors?: {
      name?: string;
      description?: string;
      productUrl?: string;
      thumbnailUrl?: string;
    };
  };

interface ProductFormProps {
    mode: 'create' | 'edit';
    productId?: string;
    defaultValues?: {
        name: string;
        description: string;
        productUrl: string;
        thumbnailUrl: string;
        integrationSettings: any;
        //... other default values like links, questions, etc.
    };
    actionData?: ActionData;
}
const ProductForm: React.FC<ProductFormProps> = ({ mode, productId, defaultValues, actionData }) => {
  const [name, setName] = useState<string>(defaultValues?.name || '');
  const [description, setDescription] = useState(defaultValues?.description || '');

  const nameRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLInputElement>(null);
  const productUrlRef = React.useRef<HTMLInputElement>(null);
  const thumbnailUrlRef = React.useRef<HTMLInputElement>(null);
  
  const integrationSettings = defaultValues?.integrationSettings ? JSON.parse(defaultValues.integrationSettings) : {};

  console.log('default values', defaultValues, integrationSettings);

  const [links, setLinks] = useState<LinkItem[]>(integrationSettings?.links?.map((link: string, i: number) => ({ id: i, url: link })) || [{ id: Date.now(), url: '' }]);
  //const [files, setFiles] = useState<FileItem[]>([]);
  const [questions, setQuestions] = useState<QuestionItem[]>(integrationSettings?.questions?.map((question: string, i: number) => ({ id: i, text: question })) || [
      { id: 1, text: 'What is your technology stack?' },
      { id: 2, text: 'Do you have any specific requirements for this integration?' },
  ]);

  const handleLinkChange = (index: number, value: string) => {
      const newLinks = links.map((link, i) => i === index ? { ...link, url: value } : link);
      setLinks(newLinks);
  };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     if (event.target.files) {
  //         const newFiles = Array.from(event.target.files).map((file, index) => ({
  //             id: Date.now() + index,
  //             fileName: file.name,
  //         }));
  //         setFiles([...files, ...newFiles]);
  //     }
  // };

  const handleQuestionChange = (index: number, value: string) => {
      const newQuestions = questions.map((question, i) => i === index ? { ...question, text: value } : question);
      setQuestions(newQuestions);
  };

  const addLink = () => setLinks([...links, { id: Date.now(), url: '' }]);
  const removeLink = (id: number) => setLinks(links.filter(link => link.id !== id));
  // const removeFile = (id: number) => setFiles(files.filter(file => file.id !== id));

  const addQuestion = () => setQuestions([...questions, { id: Date.now(), text: '' }]);
  const removeQuestion = (id: number) => setQuestions(questions.filter(question => question.id !== id));

  const [productUrl, setProductUrl] = useState(defaultValues?.productUrl || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(defaultValues?.thumbnailUrl || '');


  return (
    <div className="p-6 text-gray-100 rounded-lg shadow-md">
      <h1 className="text-xl font-semibold mb-2">{mode === 'create' ? 'Create New Product' : 'Edit Product'}</h1>
      <div className="mb-4">
        <HelpText>Add information about your product to help your customers create a custom AI solution engineer bot.</HelpText>
      </div>
      <Form method="post"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                width: "100%",
              }}>
                {productId && (
                    <input type="hidden" name="productId" value={productId} />
                )}
            <div className="form-section bg-gray-800 p-4 rounded-md">
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2" htmlFor="name">
                    Product Name
                </label>
                <input
                    ref={nameRef}
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your Product Name"
                    className="w-full p-2 border border-gray-300 rounded text-gray-900 "
                    aria-invalid={actionData?.errors?.name ? true : undefined}
                    aria-errormessage={
                      actionData?.errors?.name ? "name-error" : undefined
                    }
                />
                {actionData?.errors?.name && (
          <div className="pt-1 text-red-700" id="name-error">
            {actionData?.errors.name}
          </div>
        )}
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium mb-2" htmlFor="name">
                    Product Description
                </label>
                <input
                    ref={descriptionRef}
                    type="text"
                    id="description"
                    name="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Your Product Description"
                    className="w-full p-2 border border-gray-300 rounded text-gray-900 "
                    aria-invalid={actionData?.errors?.description ? true : undefined}
            aria-errormessage={
              actionData?.errors?.description ? "description-error" : undefined
            }
                />
                {actionData?.errors?.description && (
          <div className="pt-1 text-red-700" id="description-error">
            {actionData?.errors.description}
          </div>
        )}
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium mb-2" htmlFor="name">
                    Product URL
                </label>
                <input
                    ref={productUrlRef}
                    type="text"
                    id="productUrl"
                    name="productUrl"
                    value={productUrl}
                    onChange={(event) => setProductUrl(event.target.value)}
                    placeholder="www.yourproduct.com"
                    className="w-full p-2 border border-gray-300 rounded text-gray-900 "
                    aria-invalid={actionData?.errors?.productUrl ? true : undefined}
            aria-errormessage={
              actionData?.errors?.productUrl ? "productUrl-error" : undefined
            }
                />
                {actionData?.errors?.productUrl && (
          <div className="pt-1 text-red-700" id="productUrl-error">
            {actionData?.errors.productUrl}
          </div>
        )}
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium mb-2" htmlFor="name">
                    Thumbnail URL (optional, will be rendered as 256x256 or 128x128 images)
                </label>
                <input
                    ref={thumbnailUrlRef}
                    type="text"
                    id="thumbnailUrl"
                    name="thumbnailUrl"
                    value={thumbnailUrl}
                    onChange={(event) => setThumbnailUrl(event.target.value)}
                    placeholder="www.site.com/image.png"
                    className="w-full p-2 border border-gray-300 rounded text-gray-900 "
                    aria-invalid={actionData?.errors?.thumbnailUrl ? true : undefined}
            aria-errormessage={
              actionData?.errors?.thumbnailUrl ? "thumbnailUrl-error" : undefined
            }
                />
                {actionData?.errors?.thumbnailUrl && (
          <div className="pt-1 text-red-700" id="thumbnailUrl-error">
            {actionData?.errors.thumbnailUrl}
          </div>
        )}
            </div>

          </div>{/*form-section*/}

            <div className="mt-10 form-section bg-gray-800 p-4 rounded-md">

              <label className="block text-sm font-medium mb-4">
                  Product Documentation
              </label>
              <div className="-mt-2 mb-2">
                <HelpText>
                    This documentation is provide AI-generated solution engineers with more expertise in your product.
                </HelpText>
                </div>

              {links.map((link, index) => (
                    <div key={link.id} className="flex items-center mb-2">
                        <input
                        placeholder="Add a link to your product documentation"
                            type="text"
                            name={`links[${index}].url`}
                            className="w-full p-2 border text-gray-900 border-gray-300 rounded mr-2"
                            value={link.url}
                            onChange={(e) => handleLinkChange(index, e.target.value)}
                        />
                        <Button size="small" theme="gray" className="bg-gray-400" onClick={() => removeLink(link.id)}>
                             {/*<TrashIcon className="h-5 w-5 text-red-500" />*/}
                             ✖️
                        </Button>
                    </div>
                ))}
                <Button
                  
                    size="small"
                    theme="gray"
                    
                    onClick={addLink}
                >
                    {/*<PlusIcon className="h-5 w-5 mr-1" />*/}
                    ➕
                    Add Link
                    </Button>
                {/*<div>
                    <input
                        type="file"
                        name="file"
                        className="mt-4 mb-2 text-xs"
                        onChange={handleFileChange}
                        multiple
                    />
                    <ul>
                        {files.map(file => (
                            <li key={file.id} className="flex justify-between items-center">
                                {file.fileName}
                                <Button size="small" theme="secondary" onClick={() => removeFile(file.id)}>
                            ✖️
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div> */}

            </div>

            <div className="mt-10 form-section bg-gray-800 p-4 rounded-md">

                <label className="block text-sm font-medium mb-4">
                    Customer Onboarding Questions
                </label>
                <div className="-mt-2 mb-2">
                <HelpText>
                    These questions will be asked when setting up AI solution engineers customized for a specific product integration.
                </HelpText>
                </div>
                {questions.map((question, index) => (
                    <div key={question.id} className="flex items-center mb-2">
                        <input
                            type="text"
                            name={`questions[${index}].text`}
                            className="text-gray-900 w-full p-2 border border-gray-300 rounded mr-2"
                            value={question.text}
                            onChange={(e) => handleQuestionChange(index, e.target.value)}
                        />
                        <Button size="small" theme="gray" className="bg-gray-400" onClick={() => removeQuestion(question.id)}>
                            {/*<TrashIcon className="h-5 w-5 text-red-500" />*/}
                            ✖️
                        </Button>
                    </div>
                ))}
                <Button
                  
                    size="small"
                    theme="gray"
                    onClick={addQuestion}
                >
                    ➕
                    Add Question
                </Button>
            </div>
        <div className="mt-10">
          <Button type="submit" size="large">
            {mode === 'create' ? 'Create Product' : 'Save Changes'}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default ProductForm;
